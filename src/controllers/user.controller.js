import { asyncHandler } from '../utils/asyncHandler.js'; 
import { ApiError } from '../utils/ApiError.js';   
import { User } from '../models/user.model.js'; 
import { uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //vaildation - not empty
    //check if user already exists
    //check for images and avatar
    //upload them to cloudinary
    //create user object - create entry in database
    //remove password and refresh token from response
    //check for user creation
    //return response
 
    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    if (!fullname || !email || !username || !password ||
    [fullname, email, username, password].some(field => typeof field !== "string" || field.trim() === "")
) {
    throw new ApiError(400, "All fields are required and must be valid strings");
}

    
    const existedUser = await User.findOne({
        $or: [{ email }, { username }] 
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }   
   // console.log(req.files);
    
    const avatarLocalPath =  req.files?.avatar[0]?.path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path; 
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath): { url: "" };


    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url,
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, " Something went worng while creating user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    );
})
export { registerUser }