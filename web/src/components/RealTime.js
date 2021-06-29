import React, { useState } from "react";
// import axios from "axios";

import { Table, Modal, Radio } from "antd";
import "antd/dist/antd.css";
import { HistoryOutlined } from "@ant-design/icons";
import { setCookie, delCookie } from "./cookies";
import Tooltip from "@material-ui/core/Tooltip";

import "../css/fav.css";

import StarIcon from "@material-ui/icons/Star";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import Refresh from "@material-ui/icons/Refresh";

const RealTimeInfo = ({ realTimeData, favStops, setFavStops, setRealTime }) => {
  // generate content of real-time tab
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState({});
  const [alertTime, setAlertTime] = useState(1);
  const stopid = realTimeData.stopid;
  const fullname = realTimeData.fullname;
  realTimeData = realTimeData.data;
  // This will default to false until the data is loaded in, this the below if statement will correct this
  const flgIcon = favStops.stopsids.includes(stopid);
  const [icoStatus, seticoStatus] = useState(flgIcon);
  if (flgIcon !== icoStatus) {
    seticoStatus(flgIcon);
  }

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const iconStatusData = (e) => {
    // adding/deleting cookies
    seticoStatus(!icoStatus);
    if (icoStatus) {
      delCookie(stopid);
      setFavStops({
        fullname: removeItemOnce(favStops.fullname, fullname),
        stopsids: removeItemOnce(favStops.stopsids, stopid),
      });
    } else {
      setCookie(stopid, fullname);
      favStops.fullname.push(fullname);
      favStops.stopsids.push(stopid);
      setFavStops({
        fullname: favStops.fullname,
        stopsids: favStops.stopsids,
      });
    }
  };

  const columns = [
    // Set up for table
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Due",
      dataIndex: "duetime",
      key: "duetime",
    },
    {
      title: "Set Alert",
      key: "duetimeButton",
      render: (text, record) => (
        <HistoryOutlined
          onClick={() => showModal(record.route, record.duetime)}
        />
      ),
    },
  ];
  const showModal = (route, duetime) => {
    setState({
      route,
      duetime,
    });
    setVisible(true);
  };

  const handleOk = (e) => {
    setVisible(false);
    setTimeout(setAlert, (state.duetime - alertTime) * 60000);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  const onRadioChange = (e) => {
    setAlertTime(e.target.value);
  };

  function setAlert() {
    alert(
      `The ${state.route} is due in ${alertTime} ${
        alertTime < 2 ? "minute" : "minutes"
      }`
    );
  }

  return (
    <div className="realTime">
      <div className="Title">
        <h2>
          {realTimeData ? `${fullname} (Stop ${stopid})` : "Select a bus stop"}
        </h2>
        {realTimeData && (
          <div>
            <Tooltip className="tooltip" title="Refresh">
              <Refresh
                className="buttons left"
                fontSize="large"
                onClick={() => setRealTime(stopid, fullname)}
              />
            </Tooltip>
            <Tooltip className="tooltip" title="Toggle Favourite">
              {icoStatus ? (
                <StarIcon
                  className="buttons right"
                  fontSize="large"
                  onClick={(e) => iconStatusData()}
                />
              ) : (
                <StarBorderOutlinedIcon
                  className="buttons right"
                  fontSize="large"
                  onClick={(e) => iconStatusData()}
                />
              )}
            </Tooltip>
          </div>
        )}
      </div>
      <Table
        dataSource={realTimeData}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.arrivaldatetime + record.route}
      />
      <Modal
        title="Set Alert"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        I want to be notified when the {state.route} is due in
        <Radio.Group
          onChange={onRadioChange}
          defaultValue="1"
          buttonStyle="solid"
        >
          <Radio.Button
            value="1"
            disabled={state.duetime === "Due" ? true : false}
          >
            1 mins
          </Radio.Button>
          <Radio.Button
            value="5"
            disabled={
              state.duetime <= 5 || state.duetime === "Due" ? true : false
            }
          >
            5 mins
          </Radio.Button>
          <Radio.Button
            value="10"
            disabled={
              state.duetime <= 10 || state.duetime === "Due" ? true : false
            }
          >
            10 mins
          </Radio.Button>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default RealTimeInfo;
