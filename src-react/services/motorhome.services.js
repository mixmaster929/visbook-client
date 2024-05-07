import axios from "axios";
import config from "./config";

const WP_API_URL = config.WP_Rest_API;
const WS_Visbook_RemoteTestAPI = config.RemoteTestAPI;

const getAllContents = async() => {
  return await axios.get(WP_API_URL);
};

const emailConfirmation = async(email) => {
  return await axios.post(config.RemoteTest_API+"email-confirmation", {email});
};
const phoneNumberConfirmation = async(countryCode, phoneNumber) => {
  console.log("phoneNumberConfirmation=>", countryCode, phoneNumber);
  return await axios.post(config.RemoteTest_API+"phonenumber-confirmation", {countryCode, phoneNumber});
};

const checkAvailability = async(start, end, product_id, entity_id = '10268') => {
  // console.log("checkAvailability=>", WS_Visbook_RemoteTestAPI + 'availability/?product_id=' + product_id + '&end_date=' + end);
  return await axios.get(WS_Visbook_RemoteTestAPI + 'availability/?product_id=' + product_id + '&end_date=' + end);
};

const getPrices = async(start, end, product_id, entity_id = '10268') => {
  // console.log("getPrices=>", WS_Visbook_RemoteTestAPI + 'webproducts/?start_date=' + start + '&end_date=' + end + '&product_id=' + product_id);
  return await axios.get(WS_Visbook_RemoteTestAPI + 'webproducts/?start_date=' + start + '&end_date=' + end + '&product_id=' + product_id);
};

const checkAllAvailability = async(start, end, entity_id = '10268') => {
  return await axios.get(WS_Visbook_RemoteTestAPI + 'webproducts/?start_date=' + start + '&end_date=' + end );
};

const getFullImagePath = (image, webProductId) => {
  const imagePathParts = image.split('/');
  const folderName = imagePathParts[1];
  const fileName = imagePathParts[2];

  // Construct the full URL
  return `${config.imageBaseURL}${webProductId}/${folderName}_${fileName}`;
};

const MotorHomeServices = {
  getAllContents,
  checkAvailability,
  getPrices,
  getFullImagePath,
  checkAllAvailability,
  emailConfirmation,
  phoneNumberConfirmation
};

export default MotorHomeServices;
