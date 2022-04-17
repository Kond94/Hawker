import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import CheckBox from "../CheckBox";

function FormCheckBox({ text, name }) {
  const { errors, setFieldValue, values, touched } = useFormikContext();

  return (
    <>
      <CheckBox
        value={values[name]}
        onValueChanged={(value) => setFieldValue(name, value)}
        text={text}
      />

      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormCheckBox;
