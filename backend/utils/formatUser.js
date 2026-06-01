export const formatUserResponse = (user, token = null) => {
  const data = {
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    address: user.address || {},
    profilePic: user.profilePic || "",
    role: user.role,
  };

  if (token) {
    data.token = token;
  }

  return data;
};
