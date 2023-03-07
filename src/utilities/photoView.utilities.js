export const UserLogo = (size) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size.w}
        height={size.h}
        fill="currentColor"
        className="bi bi-person-circle"
        viewBox="0 0 16 16"
      >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path
          fillRule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
        />
      </svg>
    </div>
  );
};
export const StoreLogo = (size) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size.w}
        height={size.h}
        fill="currentColor"
        className="bi bi-shop"
        viewBox="0 0 16 16"
      >
        <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
      </svg>
    </div>
  );
};
export const PhotoView = (img) => {
  let num = img.s.substring(0, 2);
  num = num / 2;
  const br = num + "px";
  if (img.img) {
    return (
      <div>
        <img
          style={{
            maxWidth: `${img.s}`,
            maxHeight: `${img.s}`,
            minWidth: `${img.s}`,
            minHeight: `${img.s}`,
            borderRadius: `${br}`,
            objectFit: "cover",
          }}
          src={img.img}
          alt="profile"
          className="me-2"
        />
      </div>
    );
  } else {
    return <UserLogo w={img.s} h={img.s} />;
  }
};
export const PhotoStoreView = (img) => {
  let num = img.s.substring(0, 2);
  num = num / 4;
  const br = num + "px";
  if (img.img) {
    return (
      <div>
        <img
          style={{
            maxWidth: `${img.s}`,
            maxHeight: `${img.s}`,
            minWidth: `${img.s}`,
            minHeight: `${img.s}`,
            borderRadius: `${br}`,
            objectFit: "cover",
          }}
          src={img.img}
          alt="profile"
          className="me-2"
        />
      </div>
    );
  } else {
    return <StoreLogo w={img.s} h={img.s} />;
  }
};
export const ProductLogo = (size) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size.w}
        height={size.h}
        fill="currentColor"
        className="bi bi-archive-fill"
        viewBox="0 0 16 16"
      >
        <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z" />
      </svg>
    </div>
  );
};
export const PhotoProductView = (img) => {
  let num = img.s.substring(0, 2);
  num = num / 4;
  const br = num + "px";
  if (img.img) {
    return (
      <div>
        <img
          style={{
            maxWidth: `${img.s}`,
            maxHeight: `${img.s}`,
            minWidth: `${img.s}`,
            minHeight: `${img.s}`,
            borderRadius: `${br}`,
            objectFit: "cover",
          }}
          src={img.img}
          alt="profile"
          className="me-2"
        />
      </div>
    );
  } else {
    return <ProductLogo w={img.s} h={img.s} />;
  }
};
