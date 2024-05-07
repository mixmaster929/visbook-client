import React, { useState, useEffect, useCallback, useRef } from "react";
import images from "../components/Images";
import PickUp from "../components/Pickup";
import ReactPlayer from "react-player";
import { useLocation, Link } from "react-router-dom";
import parser from "html-react-parser";
import MotorHomeServices from "../../services/motorhome.services";
import { GridLoader } from "react-spinners";
import Verification from "./verification";
import moment from "moment";
import DateRangePickers from "../components/DateRangePickers";
import { useNavigate } from "react-router-dom";
import NoAvailable from "../components/NoAvailable";
// import "./styles.css";
import MotorHomeFunctions from "../../services/motorhome.functions";
import ProductService from "../../services/motorhome.services";
import { useTranslation } from 'react-i18next';
import validator from 'validator';

const LongText = ({ content, limit }) => {
  const [showAll, setShowAll] = useState(false);

  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);

  if (content.length <= limit) {
    return <div>{parser(content)}</div>;
  }
  if (showAll) {
    return (
      <div>
        {parser(content)}
        <button className="order-detail-read-less" onClick={showLess}>
          Read less
        </button>
      </div>
    );
  }
  const toShow = content.substring(0, limit) + "...";
  return (
    <div>
      {parser(toShow)}
      <button className="order-detail-read-more" onClick={showMore}>
        Read more
      </button>
    </div>
  );
};

const Order = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  console.log("currentLanguage=>", currentLanguage);
  const propertyText = currentLanguage.split("_")[0] !="en"? "propertyText_"+currentLanguage.replace("_", "-") : "propertyText" ;
  const name = currentLanguage.split("_")[0] !="en"? "name_"+currentLanguage.replace("_", "-") : "name" ;
  const [lang, setLang] = useState(currentLanguage.split("_")[0] === "en");
  // const name = currentLanguage.split("-")[0] === "en"? "name": "name_"+countryCodes.find(each => each.code === currentLanguage).name;
  // console.log("currentLanguage name=>", String(currentLanguage).split("-")[0]);
  // const name = String(currentLanguage).split("-")[0] === "en"? "name": "name_"+currentLanguage;
  console.log("currentLanguage name=>", name, propertyText);
  const data = JSON.parse(localStorage.getItem("product"));
  const searchResult = JSON.parse(localStorage.getItem("searchResult"));
  const resultByproduct = JSON.parse(localStorage.getItem("resultByproduct"));
  const navigate = useNavigate();
  const { state } = useLocation();
  const [additionalPrices, setAddtionalPrices] = useState(0);
  const [booked, setBooked] = useState(data?.booked ? data.booked : false); // false: from Check Availability, true: from Book
  const [product, setProduct] = useState(data?.product ? data.product : []);
  const [result, setSearchResult] = useState(searchResult ? searchResult : []);
  const [ordered, setOrdered] = useState(false);
  const [selectedExtraValue, setSelectedExtraValue] = useState([]);
  const [productType, setProductType] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isProductLoading, setProductLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [conifirmEmail, setConifirmEmail] = useState();
  const [conifirmCode, setConfirmCode] = useState();
  const [countryCode, setCountryCode] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [startDate, setStartDate] = useState(
    result && booked ? result[2] : state?.from ? state.from : null
  );
  const [endDate, setEndDate] = useState(
    result && booked ? result[3] : state?.to ? state.to : null
  );
  const [currentLocation, setCurrentLocations] = useState(
    result && booked
      ? result[4]
      : state?.location
      ? state.location
      : data?.product
      ? data.product.acf.properties[0].propertyText
      : "base"
  );
  const [price, setPrice] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [number_of_persons, setNumberOfPersons] = useState(1);
  const [confirmOrderStatus, setConfirmOrderStatus] = useState(0);
  const [cachedDates, setCachedDates] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    },
  ]);

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMobileChange = (event) => {
      setIsMobile(event.matches);
    };
    handleMobileChange(mobileMediaQuery);
    mobileMediaQuery.addListener(handleMobileChange);

    return () => {
      mobileMediaQuery.removeListener(handleMobileChange);
    };
  }, []);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("product"))?.product) {
      navigate("/");
      return;
    }

    const parts = parser(product.title?.rendered);
    const xd = parts.split(/\(|\)/);
    const data = xd.filter((part) => part.trim() != "");

    setProductType(data[0] + "(" + data[1] + ")");
  }, []);

  const onPickupPoint = useCallback((location) => {
    console.log("useCallback", location);
    setProductLoading(true);
    MotorHomeServices.getAllContents().then(
      (response) => {
        const products = response.data.filter((product) =>
          product.acf.properties.find(
            (property) => property.propertyText === location
          )
        );
        // console.log("productType=>", productType);
        const sampeTypeProduct = products.find((item) =>
          item.title?.rendered.includes(productType)
        );
        // console.log("sampeTypeProduct=>", sampeTypeProduct);
        setProduct(sampeTypeProduct);
        const data = localStorage.getItem("product");
        const product = {
          product: sampeTypeProduct,
          booked: JSON.parse(data).booked,
        };
        localStorage.setItem("product", JSON.stringify(product));
        setCurrentLocations(location);
        setStartDate(null);
        setEndDate(null);
        setCachedDates([]);
        setAvailableDates([]);
        setProductLoading(false);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log("error=>", _content);
      }
    );
  }, []);
  const getProductPrice = useCallback(() => {
    console.log("getProductPrice", startDate, endDate, currentLocation, booked);
    if (startDate != null && endDate != null && currentLocation != "base" && booked) {
      // console.log("here here");
      setLoading(true);
      const startdate = moment(startDate).format("YYYY-MM-DD");
      const enddate = moment(endDate).format("YYYY-MM-DD");
      (async () => {

        const data = await ProductService.getPrices(
          startdate,
          enddate,
          product.acf.web_product_id
        ).then(
          (response) => {
            setProductPrices(response.data);
            setLoading(false);
          }
        ).catch(error => {
          setLoading(false);
          console.error('Error in one of the promises:', error);
        });
      })();
    }
  }, []);
  useEffect(() => {
    console.log("here", startDate, endDate, currentLocation, booked);
    if (
      startDate != null &&
      endDate != null &&
      currentLocation != "base" &&
      booked
    ) {
      // console.log("here here");
      setLoading(true);
      const startdate = moment(startDate).format("YYYY-MM-DD");
      const enddate = moment(endDate).format("YYYY-MM-DD");
      (async () => {
        const data = await ProductService.getPrices(
          startdate,
          enddate,
          product.acf.web_product_id
        )
          .then((response) => {
            setProductPrices(response.data);
            // setNumberOfPersons(response.data.maxPeople)
            // const available = response.data?.availability?.available;
            // const calculatedPrice = response.data?.prices[0]?.calculatedPrice;
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error in one of the promises:", error);
          });
      })();
    } else {
      const end_date = endDate ? endDate : new Date();
      const start_date = startDate ? startDate : new Date();

      if (
        cachedDates.includes(moment(start_date).format("YYYY-MM")) &&
        cachedDates.includes(moment(end_date).format("YYYY-MM"))
      )
        return;

      setLoading(true);
      let availables = [];
      let newAvailableDate, newCachedDate;

      if (cachedDates.length > 0) {
        if (cachedDates.includes(moment(start_date).format("YYYY-MM"))) {
          newAvailableDate = moment(end_date).format("YYYY-MM");
          newCachedDate = [...cachedDates, newAvailableDate];
        } else {
          newAvailableDate = moment(start_date).format("YYYY-MM");
          newCachedDate = [...cachedDates, newAvailableDate];
        }

        availables.push(newAvailableDate);
        setCachedDates(newCachedDate);
      } else {
        for (let i = 0; i < 4; i++) {
          const date = moment(end_date);
          const nextMonthDate = date.add(i, "months");
          availables.push(moment(nextMonthDate).format("YYYY-MM"));
        }
        setCachedDates(availables);
      }

      (async () => {
        let newAvailableDates = [];
        const data = await Promise.all(
          availables.map(async (each) => {
            const response = await MotorHomeServices.checkAvailability(
              each,
              each,
              product.acf.web_product_id
            );
            const _availables = response.data.items.filter(
              (each) => each.webProducts[0].availability.available === true
            );
            const _availableDates =
              _availables.length > 0 &&
              _availables.map((each) =>
                newAvailableDates.push(moment(each.date).format("YYYY-MM-DD"))
              );

            return [_availableDates];
          })
        );
        // console.log(highlights, "<=highlights");

        if (availableDates.length > 0) {
          const newData = [...availableDates, ...newAvailableDates];
          setAvailableDates(newData);
        } else {
          setAvailableDates(newAvailableDates);
        }

        setLoading(false);
      })();
    }
  }, [product, endDate, startDate, booked]);
  console.log(productPrices, "<=productPrices");

  useEffect(() => {
    let totalPrice = 0;
    setNumberOfPersons(product?.acf?.maxPeople);
    product?.acf?.additional_services.length > 0 &&
      product.acf.additional_services
        .filter((each) => each.rules[0].selectedByDefault === true)
        .map((_each) => {
          if (_each.service_type === "perDay") {
            totalPrice +=
              Number(_each.price) *
              MotorHomeFunctions.getAllDatesBetweenMonths(startDate, endDate);
          } else {
            totalPrice += Number(_each.price);
          }
        });
    setAddtionalPrices(totalPrice);
  }, []);
  const onClickCloseCalendar = () => {
    const selectedData = [
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ];
    setSelectedDates(selectedData);
    setEndDate(null);
    setStartDate(null);
    // setBooked(false);
    const data = localStorage.getItem("searchResult");
    const searchResult = [
      JSON.parse(data)[0],
      JSON.parse(data)[1],
      null,
      null,
      JSON.parse(data)[4],
    ];
    localStorage.setItem("searchResult", JSON.stringify(searchResult));
  };
  // const getObjectPropertyValue = (obj, key) =>{
  //   return obj[key];
  // }
  const onClickMobileOrder = () => {
    setOrdered(true);
  };
  const onClickOrder = () => {
    setOrdered(true);
  };
  const onChangeNumberOfPersonsClick = (e) => {
    setNumberOfPersons(e.target.value);
  };
  // const onSetStartDate = (startDate) => {
  //   setStartDate(startDate);
  // };
  // const onSetEndDate = (endDate) => {
  //   console.log("endDate=>", endDate);
  //   setEndDate(endDate);
  // };
  const onSetDateRange = (range) => {
    setSelectedDates(range);
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    const searchResult = JSON.parse(localStorage.getItem("searchResult"));
    const data = [
      searchResult ? searchResult[0] : null,
      searchResult ? searchResult[1] : null,
      range[0].startDate,
      range[0].endDate,
      currentLocation,
    ];
    localStorage.setItem("searchResult", JSON.stringify(data));
    // console.log("range=>", range);
  };
  // const onPickupPoint = (location) => {
  //   setCurrentLocations(location);
  // };

  const onClickBook = () => {
    if (currentLocation && startDate && endDate) {
      getProductPrice();
      const data = localStorage.getItem("product");
      const product = {
        product: JSON.parse(data).product,
        booked: true,
      };
      localStorage.setItem("product", JSON.stringify(product));
      setBooked(true);
    } else console.log("no data");
  };

  // console.log("highlightDates=>", availableDates);
  // console.log("cachedDates=>", cachedDates);
  const handleStartMonthChange = (date) => {
    console.log("handleStartMonthChange", date);
    setStartDate(date);
  };

  const handleEndMonthChange = (date) => {
    console.log("handleEndMonthChange", date);
    setEndDate(date);
  };

  const handleFocus = (e) => {
    if (e.target.value) {
      setStartDate(e.target.value);
    } else {
      setStartDate(new Date());
    }
  };
  const onClickAdditionalSelect = (e, id, price) => {
    const count = Number(e.target.value);
    const total = Number(price) * count;
    let prices;
    if (selectedExtraValue.find((each) => each.id === id)) {
      console.log("id=>", id);
      prices = additionalPrices - selectedExtraValue.find(each => each.id === id).total + total;
      setAddtionalPrices(prices);
      setSelectedExtraValue((prevData) => {
        return prevData.map((item) => {
          if (item.id === id) {
            return { ...item, ...{ count: count, total: total } };
          }
          return item;
        });
      });
    } else {
      console.log("id else=>", id);
      prices = additionalPrices + total;
      setSelectedExtraValue([
        ...selectedExtraValue,
        { id: id, count: count, total: total },
      ]);
      setAddtionalPrices(prices);
    }
    // setAddtionalPrices(prices)
  };
  console.log("selectedExtraValue=>", selectedExtraValue);
  const convertDateType1 = (date) => {
    if (date != null) {
      const data =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2);
      return data;
    }
  };

  const convertDateType = (date) => {
    if (date != null) {
      const data =
        ("0" + date.getDate()).slice(-2) +
        "." +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "." +
        date.getFullYear();
      return data;
    }
  };

  const onClickConfirmOrder = async (status) => {
    console.log("status=>", status)
    if(status === 1)
      setConfirmOrderStatus(status);

    if ((status === 2 || status === 3) && isEmailValid && conifirmEmail) {
      
      try {
        MotorHomeServices.emailConfirmation(conifirmEmail).then(
        (response) =>{
          console.log("response.data=>", response)
        }
        )
      } catch (error) {
        console.log("response.error=>", error)
      }
      setConfirmOrderStatus(status);
      setConifirmEmail();
    }
    if ((status === 2 || status === 3) && countryCode && phoneNumber) {
      const number = String(phoneNumber).slice(String(countryCode).length, String(phoneNumber).length);
      try {
        MotorHomeServices.phoneNumberConfirmation(countryCode, number).then(
        (response) =>{
          console.log("response.data=>", response)
        }
        )
      } catch (error) {
        console.log("response.error=>", error)
      }
      setConfirmOrderStatus(status);
      // setConifirmEmail();
    }
    if (status === 4 && conifirmCode) {
      setConfirmOrderStatus(status);
    }
    if (status === 5) {
      setConfirmOrderStatus(1);
    }
  };

  const onChangeEmailHandler = (data) => {
    setConifirmEmail(data);
    
    if (data)
      setIsEmailValid(validator.isEmail(data));
    else
      setIsEmailValid(true)
  };

  const onChangePhoneHandler = (data) => {
    console.log("onChangePhoneHandler=>", data);
  };

  const handlePhoneNumberChange = (value, country) => {
    console.log("country=>", country, value);
    setPhoneNumber(value);
    setCountryCode(country.dialCode)
  };

  const onChangeConfirmHandler = (data) => {
    setConfirmCode(data);
  };

  const onChangeclick = (e) => {
    console.log(e.target.value);
  };
  // console.log("feffefefefe=>", startDate, endDate, endDate>startDate);
  const Booking = () => {
    return (
      <div className="box-booked bg-white px-3">
        <div className="row motorhome-booked-description mt-5">
          <h2 className="motorhome-text9">
            {t('order.booking.title')}
          </h2>
          <hr className="mt-5" />
          <div className="col-md-7 d-flex flex-column pt-3">
            <select
              className="p-2 mt-2 w-25 form-select"
              onChange={(e) => onChangeclick(e)}
            >
              <option defaultValue>Mr.</option>
              <option>Mrs.</option>
            </select>
            <input
              className="mt-2 w-75"
              type="text"
              placeholder="Name"
              onChange={(e) => onChangeclick(e)}
            />
            <input
              className="mt-2 w-75"
              type="text"
              placeholder="Surname"
              onChange={(e) => onChangeclick(e)}
            />
            <input
              className="mt-2 w-75"
              type="text"
              placeholder="Address"
              onChange={(e) => onChangeclick(e)}
            />
            <select
              className="country p-2 mt-2 w-50 form-select"
              onChange={(e) => onChangeclick(e)}
            >
              <option defaultValue>Country</option>
              <option>1</option>
            </select>
            <select
              className="year_of_birth p-2 mt-2 w-50 form-select"
              onChange={(e) => onChangeclick(e)}
            >
              <option defaultValue>Year of birth.</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
            <input
              className="mt-2 w-75"
              type="text"
              placeholder="Cell"
              onChange={(e) => onChangeclick(e)}
            />
            <input
              className="mt-2 w-75"
              type="text"
              placeholder="Mail"
              onChange={(e) => onChangeclick(e)}
            />
            <input
              className="mt-2 w-75"
              type="text"
              placeholder="Repeat mail"
              onChange={(e) => onChangeclick(e)}
            />
            <div className="mb-3 text-box pt-3">
              <label htmlFor="notes" className="form-label"></label>
              <textarea
                className="form-control notes"
                id="notes"
                rows="8"
                placeholder="Notes (optional)"
              ></textarea>
            </div>

            {/* <div className="">
              <span>Summary</span>
              <span>(it's not to late to add additional extras)</span>
          </div> */}
          </div>
          <div className="col-md-5 bg-white px-3 pt-4">
            <div className="total-price-box">
              <div className="p-5">
                <div className="motorhome-text5">{t('order.booking.total_price')}</div>
                <h2 className="motorhome-red">
                  {productPrices?.prices?.length > 0 &&
                    productPrices.prices[0].pricePerStep *
                      MotorHomeFunctions.getAllDatesBetweenMonths(
                        startDate,
                        endDate
                      ) +
                      additionalPrices}
                  ,-
                </h2>
                <div className="mt-4">
                  <div>
                    <span>{t('order.booking.persons')}</span>
                    <span className="ps-3">{number_of_persons}</span>
                  </div>
                  <div>
                    <span>{t('order.booking.price_per_night')}</span>
                    <span className="ps-3">
                      {productPrices?.prices?.length > 0 &&
                        productPrices.prices[0].pricePerStep}
                      ,-
                    </span>
                  </div>
                  <div>
                    <span>{t('order.booking.night')}</span>
                    <span className="ps-3">
                      {MotorHomeFunctions.getAllDatesBetweenMonths(
                        startDate,
                        endDate
                      )}
                    </span>
                  </div>
                  <div>
                    <span>{t('order.booking.addtionals')}</span>
                    <span className="ps-3">{additionalPrices}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div>
                    <span>{t('order.booking.pickup_point')}</span>
                    <span className="ps-3">{currentLocation}</span>
                  </div>
                  <div>
                    <span>{t('order.booking.model')}</span>
                    <span className="ps-3">
                      {parser(product.title?.rendered).split("-")[0]}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div>{t('order.booking.check_in_out')}</div>
                  <div>
                    <span>{moment(startDate).format("YYYY-MM-DD")}</span>
                    <span className="ps-2">{">"}</span>
                    <span className="ps-2">
                      {moment(endDate).format("YYYY-MM-DD")}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-row mt-4">
                  <div className="mt-n1">
                    <input type="checkbox" className="mt-n1 me-1"></input>
                  </div>
                  <div className="ms-2 text-start">
                    <div>{t('order.booking.yes')}</div>
                    <Link to="#">{t('order.booking.read_here')}</Link>
                  </div>
                </div>
              </div>
              <div className="d-grid gap-2 col-10 mx-auto pb-5">
                <button
                  className="motorhome-button"
                  onClick={() => onClickConfirmOrder(5)}
                >
                  {t('order.booking.complete_order')}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-7 bg-white px-3 pt-4">
          <h4 className="motorhome-description">
              {t('order.booking.summary')}
              <span>({t('order.booking.summary_detail')})</span>
            </h4>
            <div className="mt-5 p-3 w-75 number-persons-confirm d-flex flex-row justify-content-between">
              <div>
                <select
                  className="number_of_persons px-3 py-2"
                  onChange={(e) => onChangeNumberOfPersonsClick(e)}
                  value={number_of_persons}
                >
                  {[
                    ...Array(
                      product.acf?.properties?.find(
                        (property) => property.propertyKey === "persons_max"
                      ).propertyValue
                    ),
                  ].map((_each, index) => {
                    return (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    );
                  })}
                </select>
                <span className="ps-2">{t('order.booking.required')}</span>
              </div>
              <div></div>
            </div>
            <div className="included-box mt-5">
              <p className="motorhome-text1 pt-4">Included services</p>
              <div className="d-flex flex-row justify-content-between">
                <span></span>
                <div>
                  <span className="pe-4">{t('order.booking.price')}</span>
                  <span>{t('order.booking.total')}</span>
                </div>
              </div>
              <hr />
              {product.acf?.additional_services.length > 0 &&
                product.acf?.additional_services
                  .filter((each) => each.rules[0].selectedByDefault === true)
                  .map((each, index) => {
                    return (
                      <div
                        key={index}
                        className="d-flex flex-row justify-content-between mt-3"
                      >
                        <div className="d-flex flex-row justify-content-between">
                          <div>
                            <img
                              src={images.checked}
                              className=""
                              alt="checkbox"
                            ></img>
                          </div>
                          <div className="ms-2">{MotorHomeFunctions.getObjectPropertyValue(each, name)}</div>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                          <span className="col-6">{each.price},-</span>
                          <span className="col-6">{each.price},-</span>
                        </div>
                      </div>
                    );
                  })}
            </div>
            <div className="addiotion-extras">
              <p className="motorhome-text1 pt-5 mt-4">
                {t('order.booking.additional')}
              </p>
              <div className="d-flex flex-row justify-content-between">
                <span></span>{" "}
                <div>
                  <span className="pe-4">{t('order.booking.price')}</span>
                  <span>{t('order.booking.total')}</span>
                </div>
              </div>
              <hr />
              {product.acf?.additional_services.length > 0 &&
                product.acf?.additional_services
                  .filter((each) => each.rules[0].selectedByDefault === false)
                  .map((each, index) => {
                    return (
                      <>
                        <div className="d-flex flex-row justify-content-between">
                          <div>
                            <select
                              onChange={(e) =>
                                onClickAdditionalSelect(e, index, each.price)
                              }
                            >
                              <option value="0">0</option>
                              {[...Array(each.rules[0].maxValue)].map(
                                (_each, index) => {
                                  return (
                                    <option key={index} value={index + 1}>
                                      {index + 1}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                            <span className="ps-4">
                              {each.name.length > 70
                                ? MotorHomeFunctions.getObjectPropertyValue(each, name).substring(0, 50) + "..."
                                : MotorHomeFunctions.getObjectPropertyValue(each, name)}
                            </span>
                          </div>
                          <div>
                            <span className="pe-4">{each.price}</span>
                            <span>
                              {Number(each.price) *
                                (Number(
                                  selectedExtraValue?.find(
                                    (value) => value.id === index
                                  )?.count
                                )
                                  ? Number(
                                      selectedExtraValue.find(
                                        (value) => value.id === index
                                      ).count
                                    )
                                  : 0)}
                              ,-
                            </span>
                          </div>
                        </div>
                        <hr />
                      </>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="order-container">
      {!booked ? (
        <div className="row box">
          <div className="col-md-5 col-12 motorhome-description mt-5 py-3">
            {isProductLoading ? (
              <div className="text-center">
                <GridLoader color="#36d7b7" />
              </div>
            ) : (
              <>
                <div className="motorhome-carousel">
                  <div
                    id="carousel"
                    className="carousel slide"
                    data-bs-touch="false"
                    data-bs-interval="false"
                  >
                    <div className="carousel-inner">
                      {product.acf?.images.map((image, index) => {
                        return (
                          <div
                            key={index}
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                          >
                            <img
                              src={MotorHomeServices.getFullImagePath(
                                image.image_path,
                                product.acf.web_product_id
                              )}
                              alt={`Image ${index}`}
                              className="m-carousels-details d-block w-100"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carousel"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carousel"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
                <h4 className="motorhome-label-g">
              {t('motorhome.specs.pretext')}
            </h4>
                <h2 className="motorhome-title-g">
                  <span>{lang? parser(product?.title?.rendered) : parser(MotorHomeFunctions.getObjectPropertyValue(product.acf, name))}</span>
                </h2>

                <div className="row gx-5 p-3 motorhome-property">
                  <div className="col-4">
                    <div className="border rounded-3 text-center pt-2 motorhome-properties">
                      <img src={images.seat} alt="seat" />
                      <div className="">{product?.acf?.maxPeople} seats</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border rounded-3 text-center pt-2 motorhome-properties">
                      <img src={images.bed} alt="bed" />
                      <div className="">{product?.acf?.maxPeople} beds</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border rounded-3 text-center pt-2 motorhome-properties">
                      <img src={images.classs} alt="class" />
                      <div className="">
                        Class{" "}
                        {
                          product?.acf?.properties?.find(
                            (property) => property.propertyKey === "licence"
                          ).propertyText
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="pt-5 motorhome-description mobile">
                  {parser(MotorHomeFunctions.getObjectPropertyValue(product.acf?.properties.find(property => property.propertyKey==='description_long'), propertyText))}
                </h4>
                <div className="mobile py-5">
                  <ReactPlayer
                    url={
                      "https://www.youtube.com/watch?v=" +
                      product.acf?.properties?.find(
                        (property) => property.propertyKey === "youtube"
                      ).propertyText
                    }
                    width="100%"
                  />
                </div>
              </>
            )}
          </div>
          <div className="col-md-7 col-12">
            <div className="ordered p-5">
              <h2 className="text-center label mt-5">
              {t('order.booking.lets_go')}
              </h2>
              <div className="text-center journey-box">
                <div className="title pt-3">{t('order.booking.book_journey')}</div>
                <div className="pickup-point p-5 pt-2">
                  <PickUp
                    current={currentLocation}
                    onClickSelect={onPickupPoint}
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="text-center">
                  <GridLoader color="#36d7b7" />
                </div>
              ) : startDate != null &&
                endDate != null &&
                endDate > startDate ? null : (
                <NoAvailable />
              )}
              {currentLocation != "base" ? (
                <div className="p-4">
                  <DateRangePickers
                    direction={true}
                    isLoading={isLoading}
                    selectedDates={selectedDates}
                    highlightDates={availableDates}
                    handleStartMonthChange={handleStartMonthChange}
                    handleEndMonthChange={handleEndMonthChange}
                    onSetDateRange={onSetDateRange}
                    startDate={startDate}
                    endDate={endDate}
                    onClickCloseCalendar={onClickCloseCalendar}
                  />
                  <div className="text-center">
                    <button
                      className="book-button mt-5"
                      onClick={(e) => onClickBook(e)}
                    >
                      {t('order.booking.book')}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : confirmOrderStatus === 0 ? (
        <div className="box-booked">
          <div className="motorhome-booked-description">
            <div className="row gx-4 pickup-picker bg-white px-3 pt-4">
              <div className="col-lg-6 col-12">
                <PickUp
                  current={currentLocation}
                  onClickSelect={onPickupPoint}
                />
              </div>
              <div className="col-lg-6 col-12">
                <DateRangePickers
                  direction={true}
                  isLoading={isLoading}
                  selectedDates={selectedDates}
                  highlightDates={availableDates}
                  handleStartMonthChange={handleStartMonthChange}
                  handleEndMonthChange={handleEndMonthChange}
                  onSetDateRange={onSetDateRange}
                  startDate={startDate}
                  endDate={endDate}
                  onClickCloseCalendar={onClickCloseCalendar}
                />
              </div>
            </div>
            <div className="row gx-4 pickup-picker bg-white px-3 pt-4">
              <div className="col-md-6 motorhome-carousel">
                <div
                  id="carousel"
                  className="carousel slide"
                  data-bs-touch="false"
                  data-bs-interval="false"
                >
                  <div className="carousel-inner">
                    {product.acf?.images.map((image, index) => {
                      return (
                        <div
                          key={index}
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          <img
                            src={MotorHomeServices.getFullImagePath(
                              image.image_path,
                              product.acf.web_product_id
                            )}
                            alt={`Image ${index}`}
                            className="m-carousels-details d-block w-100"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="pt-3 motorhome-text5">
                  <span>Practical and spacious</span>
                </div>
                <h2 className="pt-2  motorhome-title-g">
                  <span>{parser(product.title?.rendered)}</span>
                </h2>
                <LongText content={product.content?.rendered} limit={300} />
              </div>
            </div>
          </div>
          <div className="row motorhome-booked-description mt-5">
            <div className="col-md-7 bg-white px-3 pt-4">
              <div className="p-3 number-persons-complete d-flex flex-row justify-content-between">
                <div>
                  <select
                    className="number_of_persons px-1 py-1"
                    onChange={(e) => onChangeNumberOfPersonsClick(e)}
                    value={number_of_persons}
                  >
                    {[
                      ...Array(
                        product.acf?.properties?.find(
                          (property) => property.propertyKey === "persons_max"
                        ).propertyValue
                      ),
                    ].map((_each, index) => {
                      return (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      );
                    })}
                  </select>
                  <span className="ps-2">{t('order.booking.required')}</span>
                </div>
                <div></div>
              </div>
              <div className="included-box mt-5">
                <p className="motorhome-text1 pt-4">Included services</p>
                <div className="d-flex flex-row justify-content-between">
                  <span></span>
                  <div>
                    <span className="pe-4">{t('order.booking.price')}</span>
                    <span>{t('order.booking.total')}</span>
                  </div>
                </div>
                <hr />
                {product.acf?.additional_services.length > 0 &&
                  product.acf?.additional_services
                    .filter((each) => each.rules[0].selectedByDefault === true)
                    .map((each, index) => {
                      return (
                        <div
                          key={index}
                          className="d-flex flex-row justify-content-between mt-3"
                        >
                          <div className="d-flex flex-row ">
                            <div>
                              <img
                                src={images.checked}
                                className=""
                                alt="checkbox"
                              ></img>
                            </div>
                            <div className="ms-2">{MotorHomeFunctions.getObjectPropertyValue(each, name)}</div>
                          </div>
                          <div className="d-flex flex-row justify-content-between">
                            <span className="col-6 pe-4">{each.price},-</span>
                            {/*each.service_type === 'perDay' ? '/night' : null*/}
                            <span className="col-6">
                              {each.price *
                                (each.service_type === "perDay"
                                  ? MotorHomeFunctions.getAllDatesBetweenMonths(
                                      startDate,
                                      endDate
                                    )
                                  : 1)}
                              ,-
                            </span>
                          </div>
                        </div>
                      );
                    })}
              </div>
              <div className="addiotion-extras">
                <p className="motorhome-text1 pt-5 mt-4">
                {t('order.booking.additional')}
                </p>
                <div className="d-flex flex-row justify-content-between">
                  <span></span>
                  <div>
                    <span className="pe-4">{t('order.booking.price')}</span>
                    <span>{t('order.booking.total')}</span>
                  </div>
                </div>
                <hr />
                {product.acf?.additional_services.length > 0 &&
                  product.acf?.additional_services
                    .filter((each) => each.rules[0].selectedByDefault === false)
                    .map((each, index) => {
                      return (
                        <>
                          <div className="d-flex flex-row justify-content-between">
                            <div>
                              <select
                                onChange={(e) =>
                                  onClickAdditionalSelect(e, index, each.price)
                                }
                              >
                                <option value="0">0</option>
                                {[...Array(each.rules[0].maxValue)].map(
                                  (_each, index) => {
                                    return (
                                      <option key={index} value={index + 1}>
                                        {index + 1}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                              <span className="ps-4">
                                {each.name.length > 70
                                  ? MotorHomeFunctions.getObjectPropertyValue(each, name).substring(0, 50) + "..."
                                  : MotorHomeFunctions.getObjectPropertyValue(each, name)}
                              </span>
                            </div>
                            <div>
                              <span className="pe-4">{each.price},- </span>
                              <span>
                                {Number(each.price) *
                                  (Number(
                                    selectedExtraValue?.find(
                                      (value) => value.id === index
                                    )?.count
                                  )
                                    ? Number(
                                        selectedExtraValue.find(
                                          (value) => value.id === index
                                        ).count
                                      )
                                    : 0)}
                                ,-
                              </span>
                            </div>
                          </div>
                          <hr />
                        </>
                      );
                    })}
              </div>
            </div>
            <div className="col-md-5 bg-white px-3 pt-4">
              {startDate && endDate ? (
                <div className="total-price-box">
                  <div className="p-5">
                    <div className="motorhome-text5">{t('order.booking.total_price')}</div>
                    <h2 className="motorhome-red">
                      {productPrices?.prices?.length > 0 &&
                        productPrices.prices[0].pricePerStep *
                          MotorHomeFunctions.getAllDatesBetweenMonths(
                            startDate,
                            endDate
                          ) +
                          additionalPrices}
                      ,-
                    </h2>
                    <div className="mt-5">
                      <div>
                        <span>{t('order.booking.persons')}</span>
                        <span className="ps-3">{number_of_persons}</span>
                      </div>
                      <div>
                        <span>{t('order.booking.price_per_night')}</span>
                        <span className="ps-3">
                          {productPrices?.prices?.length > 0 &&
                            productPrices.prices[0].pricePerStep}
                          ,-
                        </span>
                      </div>
                      <div>
                        <span>{t('order.booking.night')}</span>
                        <span className="ps-3">
                          {MotorHomeFunctions.getAllDatesBetweenMonths(
                            startDate,
                            endDate
                          )}
                        </span>
                      </div>
                      <div>
                        <span>{t('order.booking.addtionals')}</span>
                        <span className="ps-3">{additionalPrices}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div>
                        <span>{t('order.booking.pickup_point')}</span>
                        <span className="ps-3">{currentLocation}</span>
                      </div>
                      <div>
                        <span>{t('order.booking.model')}</span>
                        <span className="ps-3">
                          {parser(product.title?.rendered).split("-")[0]}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div>{t('order.booking.check_in_out')}</div>
                      <div>
                        <span>{moment(startDate).format("YYYY-MM-DD")}</span>
                        <span className="ps-2">{">"}</span>
                        <span className="ps-2">
                          {moment(endDate).format("YYYY-MM-DD")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-2 col-10 mx-auto pb-5">
                    <button
                      className="motorhome-button number-persons-confirm"
                      onClick={() => onClickConfirmOrder(1)}
                    >
                      {t('order.booking.confirm_order')}
                    </button>
                  </div>
                </div>
              ) : (
                <NoAvailable />
              )}
            </div>
          </div>
        </div>
      ) : confirmOrderStatus === 4 ? (
        <Booking />
      ) : (
        <Verification
          status={confirmOrderStatus}
          statusHandler={onClickConfirmOrder}
          onChangeEmailHandler={onChangeEmailHandler}
          onChangePhoneHandler={onChangePhoneHandler}
          onChangeConfirmHandler={onChangeConfirmHandler}
          isEmailValid={isEmailValid}
          conifirmEmail={conifirmEmail}
          handlePhoneNumberChange={handlePhoneNumberChange}
          phoneNumber={phoneNumber}
        />
      )}
    </div>
  );
};

export default Order;
