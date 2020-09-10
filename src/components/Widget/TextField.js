import React from "react";
import { TextField as MuTextField } from "@material-ui/core";
import { capitalize } from "utils";

function TextField({ label, ...props }) {
  return (
    <MuTextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id={label}
      label={capitalize(label)}
      name={label}
      autoComplete={label}
      {...props}
    />
  );
}

export default TextField
