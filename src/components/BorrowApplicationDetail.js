import React from "react";
import { getBorrowApplication, updateBorrowApplication } from "../utils";
import { CardContent, Typography } from "@material-ui/core";
import ApplicationDetail from "./ApplicationDetail";

const ResourceDetail = ({ data }) => {
  return (
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        {data.candidate.username}
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        {data.usage}
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        component="p"
      ></Typography>
    </CardContent>
  );
};

function BorrowApplicationDetail() {
  return (
    <ApplicationDetail
      resource="borrow"
      getResource={getBorrowApplication}
      updateResource={updateBorrowApplication}
      ResourceDetail={ResourceDetail}
    ></ApplicationDetail>
  );
}

export default BorrowApplicationDetail;
