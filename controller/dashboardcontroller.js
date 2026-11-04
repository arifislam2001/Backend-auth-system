const usermodel = require("../model/UserModel")

function formatUser(user){
  return{
    id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    address: user.address,
    phone: user.phone,
    gender: user.gender,
    dob: user.dob,
    role: user.role,
    status: user.status,  
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}


const getallusercontroller = async (req, res) => {
  try {
    const loggdinuserId = req.user.id;
    const loggdinuser = await usermodel.findById(loggdinuserId);
    const search = req.query.search ? req.query.search.trim() : "";

    const filter = {
      _id: { $ne: loggdinuserId },
    };

    if (search) {
      const searchRegex = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { username: { $regex: searchRegex, $options: "i" } },
        { email: { $regex: searchRegex, $options: "i" } },
        { role: { $regex: searchRegex, $options: "i" } },
      ];
    }

    const user = await usermodel.find(filter);

    if (search && user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "can't find user",
      });
    }

    res.status(200).json({
      success: true,
      message: "User get Successfully",
      data: {
        user: user.map(formatUser),
        length: user.length,
      },
      loggdinuser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getsingleusercontroller = async ( req , res)=>{

  const userId = req.params.id
   try {
    const user = await usermodel.findOne({
      _id : userId
    })
    res.status(200).json({
      success : true,
      message : "User get Successfully",
      data : user

    })
  } catch (error) {
    res.status(400).json({
      success : false,
      message : error.message,
      userId : userId
    })
  }
}

const approvedUsercontroller = async (req , res)=>{

try {
    let updateUser = await usermodel.findByIdAndUpdate(
      req.params.id,
      { status : true },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({
      success: true,
      message: "user approved Successfully.",
      data: updateUser,
    });
    
  } catch (error) {
    return res.status(500).json({
     success: false, 
     message: error.message
     });
  }
  }

const deactiveUsercontroller = async (req, res)=>{
 try {
   let updateUser = await usermodel.findByIdAndUpdate(
      req.params.id,
      { status : false },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({
      success: true,
      message: "user deactive  Successfully.",
      data: updateUser,
    });
    
  } catch (error) {
  
  return res.status(500).json({
     success: false, 
     message: error.message
     });
  }
}

const deleteUsercontroller = async (req, res) => {
try {
   let deleteUser = await usermodel.findByIdAndDelete(
      req.params.id,
    );
    res.status(200).json({
      success: true,
      message: "user delete  Successfully.",
      data: deleteUser,
    });
    
  } catch (error) {
  

    return res.status(500).json({
     success: false, 
     message: error.message
     });
  }
};

const getuserupdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const updated = await usermodel.findByIdAndUpdate(
      id,
      { username },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Could not update" });
  }
};



module.exports = {
    getallusercontroller,
    deleteUsercontroller ,
    getuserupdate , 
    getsingleusercontroller , 
    approvedUsercontroller,
    deactiveUsercontroller
  }