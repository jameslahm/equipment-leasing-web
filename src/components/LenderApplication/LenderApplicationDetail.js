import React from "react";
import {ApplicationDetail} from "components/Application";
import { CardContent, Typography } from "@material-ui/core";
import { updateLenderApplication, getLenderApplication } from "utils";

const ResourceDetail = ({ data }) => {
  return (
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        {data.candidate.username}
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        {data.lab_name}
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        {data.lab_location}
      </Typography>
    </CardContent>
  );
};

function LenderApplicationDetail() {
  return (
    <ApplicationDetail
      resource="lender"
      getResource={getLenderApplication}
      updateResource={updateLenderApplication}
      ResourceDetail={ResourceDetail}
    ></ApplicationDetail>
  );
}

export default LenderApplicationDetail;
