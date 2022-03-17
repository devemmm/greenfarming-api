const User = require("../models/User");
const FarmData = require("../models/FarmData");
const Farm = require("../models/Farm");
const Disease = require("../models/Disease");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const signup = async (userInformation) => {
  try {
    const { fname, lname, phone, email, password } = userInformation;

    if (!fname || !lname || !phone || !email || !password) {
      throw new Error("missing required information please check your inputs");
    }

    const user = new User({
      ...userInformation,
    });

    return await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const signin = async (email, password) => {
  if (!email || !password) {
    throw new Error("you must provide email and password");
  }

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    return {
      user,
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const signout = async (req) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    return { message: "successfull" };
  } catch (error) {
    throw new Error(error.message);
  }
};

const signoutall = async (req) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    return { message: "successfull" };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteAccount = async (req) => {
  try {
    await req.user.remove();

    return { user: req.user };
  } catch (error) {
    throw new Error(error.message);
  }
};

const findByPK = async (type, pk) => {
  switch (type) {
    case "farm":
      return await Farm.findById(pk);
    case "user":
      return await User.findById(pk);
    default:
      return null;
  }
};

// ------------------------- FARM -------------------------------------
const registerFarm = async (farmDetails) => {
  try {
    const { uid, province, district, sector, cell, village } = farmDetails;

    if (!uid || !province || !district || !sector || !cell || !village) {
      throw new Error("missing required information");
    }

    const user = await findByPK("user", uid);

    const farm = new Farm({
      ...farmDetails,
    });

    user.farms = user.farms.concat(farm._id);

    await user.save();
    return await farm.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateAccout = async ({ user, data, type }) => {
  try {
    const userData = await User.findById(user._id);
    const { fname, lname, phone, password, oldPassword } = data;
    switch (type) {
      case "profile":
        if (!fname || !lname || !phone) {
          throw new Error("wrong updates please check your inputes field");
        }
        userData.fname = fname;
        userData.lname = lname;
        userData.phone = phone;

        await userData.save();
        delete userData.tokens;
        delete userData.password;

        return userData;

      case "password":
        if (!oldPassword || !password) {
          throw new Error(
            "missing some required values please check if you are pursing both oldPasword and password"
          );
        }
        const isMatch = await bcrypt.compare(oldPassword, userData.password);
        if (!isMatch) {
          throw new Error("wrong old password");
        }

        userData.password = password;
        await userData.save();
        return { response: "password changed sucessfull" };

      default:
        delete userData.tokens;
        delete userData.password;

        return userData;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// ----------------------- farm data -----------------------------------
const notifyFarm = async (data) => {
  try {
    const { fid, temperature, heater, fun, humidity } = data;

    if (
      !fid ||
      heater === undefined ||
      fun === undefined ||
      !temperature ||
      !humidity
    ) {
      throw new Error("missing required values");
    }

    if (fun > 1 || fun < 0 || heater > 1 || heater < 0) {
      throw new Error(
        "wrong_data_values both fun and heater values must be 0 or 1"
      );
    }

    if ((fun === heater) === 1) {
      throw new Error(
        "wrong_data_values both fun and heater can not be ON at the same_time"
      );
    }

    if (fid.length !== 24) {
      throw new Error("wrong farm");
    }

    const farm = await findByPK("farm", fid);

    if (!farm) {
      throw new Error("Farm not found");
    }

    const farmData = new FarmData({
      ...data,
    });

    return await farmData.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const formatDate = (timeStamp) => {
  const timeStamps = new Date(timeStamp);
  const year = timeStamps.getFullYear();
  const month = timeStamps.getMonth();
  const dates = timeStamps.getDate();

  const date = `${year}-${month}-${dates}`;

  return {
    date,
  };
};
const checkFarmData = async ({ type, fid }) => {
  try {
    const query = type === "all" ? { fid: fid } : {};

    const farmDataa = await FarmData.find({ fid });
    const farmData = _.reverse(farmDataa);

    if (!type || type === "last") {
      return farmData[0];
    }

    const farmPeriodaDateActionFilter = [];
    const farmPeriodaDateAction = [];

    farmData.map((item) => {
      const fmDate = formatDate(item.createdAt).date;
      const isAlreadyIn = _.includes(farmPeriodaDateActionFilter, fmDate);

      if (!isAlreadyIn) {
        farmPeriodaDateActionFilter.push(fmDate);
      }
    });

    farmPeriodaDateActionFilter.map((dt) => {
      const action = farmData.filter(
        (item) => formatDate(item.createdAt).date === dt
      );
      farmPeriodaDateAction.push({
        date: dt,
        action: action,
      });
    });

    return farmPeriodaDateAction;
  } catch (error) {
    throw new Error(error.message);
  }
};

// ---------------------TRANDING DISEASE -------------------------------

const getAllDisease = async () => {
  try {
    const diseases = await Disease.find({});
    return {
      count: diseases.length,
      diseases: _.reverse(diseases),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const registerDisease = async (data) => {
  try {
    const { name, type, image } = data;

    if (!name || !type || !image) {
      throw new Error("missing required values please check in your inputes");
    }

    const disease = new Disease({ ...data });

    return await disease.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ----------- FUNCTION AND VARIABLES EXPORTATION------------------------
module.exports = {
  signup,
  signin,
  signout,
  signoutall,
  deleteAccount,
  registerFarm,
  notifyFarm,
  checkFarmData,
  getAllDisease,
  registerDisease,
  updateAccout,
};
