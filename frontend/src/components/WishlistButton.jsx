import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleWishlistItem, selectIsInWishlist } from "../Redux/wishlistSlice";

function WishlistButton({ productId, className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const inWishlist = useSelector(selectIsInWishlist(productId));

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      navigate("/login");
      return;
    }
    dispatch(toggleWishlistItem(productId));
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors ${
        inWishlist ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
      } ${className}`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500" : ""}`} />
    </button>
  );
}

export default WishlistButton;
