import React from "react";
import { useFormikContext } from "formik";

function StoreForm({ children }) {
  const { values } = useFormikContext();

  return values["hasStore"] ? <>{children}</> : <></>;
}

export default StoreForm;
