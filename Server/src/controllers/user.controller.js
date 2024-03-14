import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // user.refreshToken = refreshToken;
    // await user.save({validateBeforeSave: false})

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, profile_img } = req.body;

  console.log(fullname);

  if ([fullname, email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
    // throw new ApiError(400, "All fields are required");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(400).json({ message: "User exists" });
  }

  let profileImg;
  if (req.files?.profile_img && req.files.profile_img.length > 0) {
    const profile_imgLocalPath = req.files?.profile_img[0]?.path;

    profileImg = await uploadFileOnCloudinary(profile_imgLocalPath);
  }

  const user = await User.create({
    fullname,
    email,
    password,
    profile_img: profileImg?.url || profile_img,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json({ "access token": refreshToken });
});

export { registerUser, loginUser };
