export const getImageUrl = (path) => {
  if (!path) {
    return "https://placehold.co/400x400/e0e7ff/4f46e5?text=No+Image";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return path.startsWith("/") ? path : `/${path}`;
};
