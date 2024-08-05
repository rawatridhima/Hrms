import React, { useEffect, useState } from "react";
import { MODES } from "../../Helper/Helper";
import { useSelector } from "react-redux";
import ToggleButton from "../../Helper/ToggleButton/ToggleButton";
import SettingService from "../../Services/SettingService";
import toast from "react-hot-toast";

const Setting = ({ handleTheme }) => {
  // States
  const theme = useSelector((state) => state.theme);
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  //funcitons
  const handleToggle = async (val, option) => {
    if (data !== null) {
      if (data[option] !== val) {
        await SettingService.update(data?.id, { ...data, [option]: val });
        setData({ ...data, [option]: val });
        toast.success(`${option} settings updated successfully!!`);
      }
    }
  };
  const getData = async () => {
    const val = await SettingService.read(
      await SettingService.getSettingId(auth.user?.id)
    );
    setData(val);
  };
  useEffect(() => {
    getData();
  }, []);
  // Settings functionality Array
  const setting = [
    {
      name: "Appearance",
      description: "Customize how your theme looks on your device",
      selectOptions: [
        {
          value: MODES.LIGHT,
          text: "Light",
          selected: theme.mode === MODES.LIGHT ? true : false,
        },
        {
          value: MODES.DARK,
          text: "Dark",
          selected: theme.mode === MODES.DARK ? true : false,
        },
      ],
      handleSelect: (mode) => {
        handleTheme(mode);
      },
    },
    {
      name: "Language",
      description: "Select your language",
      selectOptions: [
        { text: "English", value: "en", selected: true },
        { text: "Chinese", value: "zh", selected: false },
        { text: "Spanish", value: "es", selected: false },
        { text: "Arabic", value: "ar", selected: false },
        { text: "German", value: "de", selected: false },
        { text: "Portuguese", value: "pt", selected: false },
        { text: "Russian", value: "ru", selected: false },
        { text: "French", value: "fr", selected: false },
        { text: "Japanese", value: "ja", selected: false },
        { text: "Hindi", value: "hi", selected: false },
      ],
      handleSelect: () => {},
    },
    {
      name: "Mobile Push Notifications",
      description: "Receive push notification",
      type: "mobile_notify",
    },
    {
      name: "Desktop Notification",
      description: "Receive push notification  in desktop",
      type: "desktop_notify",
    },
    {
      name: "Email Notifications",
      description: "Receive email notification",
      type: "email_notify",
    },
  ];

  return (
    <div className="settings">
      {setting.map((x, i) => (
        <div key={i} className="set">
          <div className="left">
            <h3>{x.name}</h3>
            <h5>{x.description}</h5>
          </div>
          <div className="right">
            {x.selectOptions ? (
              <select
                className="select"
                onChange={(e) => x.handleSelect(e.target.value)}
              >
                {x.selectOptions.map((x1, i1) => (
                  <option key={i1} value={x1.value} selected={x1.selected}>
                    {x1.text}
                  </option>
                ))}
              </select>
            ) : (
              <ToggleButton
                value={data === null ? true : data[x.type]}
                size={window.innerWidth < 599 ? 15 : 20}
                onToggleChange={(val) => handleToggle(val, x.type)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Setting;
