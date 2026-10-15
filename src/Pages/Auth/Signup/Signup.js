import React, { useEffect, useState } from "react";
import "./../Login/Login.css";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import maroPic from "./../../../images/mero.png";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { toast } from "react-toastify";
import { singupAPI } from "../../../RTK/Auth/AuthSlice";
import {
  getAllFaculties,
  getAllFacultiesAPI,
} from "../../../RTK/Faculty/FacultySlice";
import {
  getAllGovernorates,
  getAllGovsAPI,
} from "../../../RTK/Governorate/GovernorateSlice";
import { getAllLevels, getAllLevelsAPI } from "./../../../RTK/Level/LevelSlice";

const Signup = () => {
  // For Dispatch Action
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFacultiesAPI());
    dispatch(getAllGovsAPI());
    dispatch(getAllLevelsAPI());
    dispatch(getAllGovsAPI());
  }, [dispatch]);

  // For Access Faculty Slice
  const FacultyData = useSelector(getAllFaculties);

  // For Acces Level Slice
  const levelData = useSelector(getAllLevels);

  console.log(`The Level Is `);
  console.log(levelData);

  // For Access Government Slice
  const govDat = useSelector(getAllGovernorates);

  // For Match Password
  const emailRegex = /.*/;
  const passwordRegex = /.*/;

  // For Handle Show / Not show Password
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // For Access input Filed
  const [email, setEmail] = useState("");
  const [validMail, setValidMail] = useState("idle"); // Idle || Valid || error
  const [password, setPassword] = useState("");
  const [validPassword, setVaildPassword] = useState("idle"); // Idle || Valid || error
  const [name, setName] = useState("");

  const validEmail = (em) => {
    if (emailRegex.test(em) || em === "") {
      return true;
    } else {
      return false;
    }
  };

  const validPasswordHandler = (ps) => {
    if (passwordRegex.test(ps) || ps === "") {
      return true;
    } else {
      return false;
    }
  };

  // For Check Valid Mail
  const checkValidEmail = (em) => {
    setEmail(em);

    if (validEmail(em)) {
      setValidMail("valid");
    } else {
      setValidMail("error");
    }
  };
  // For Check Password
  const checkValidPassword = (ps) => {
    setPassword(ps);
    if (validPasswordHandler(ps)) {
      setVaildPassword("valid");
    } else {
      setVaildPassword("error");
    }
  };

  // For Handle Gender Input
  const [gender, setGender] = React.useState("");

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  // For Handle Nationality Input
  const [nationaltiy, setNationality] = React.useState("");

  const handleNationality = (event) => {
    setNationality(event.target.value);
  };

  // For Handle Faculty Input
  const [faculty, setFaculty] = React.useState("");

  const handleFaculty = (event) => {
    setFaculty(event.target.value);
  };

  // For Handle Level Input
  const [level, setLevel] = React.useState("");

  const handleLevel = (event) => {
    setLevel(event.target.value);
  };
  // For Handle Government Input
  const [gov, setGov] = React.useState("");

  const handleGov = (event) => {
    setGov(event.target.value);
  };

  // For Access Nation Id
  const [nationalID, setNationalID] = useState("");

  // For Access Phone
  const [phone, setPhone] = useState("");

  // For Access Date
  const [date, setDate] = useState("");

  const handleChangeDate = (day, month, year) => {
    setDate(
      `${year}-${month.toString.length === 1 ? "0" + month.toString() : month.toString()}-${day.toString().length === 1 ? "0" + day : day}`,
    );
  };

  console.log(date);

  // For Acces Profile Pic
  const [profilePic, setProfilePic] = useState("");

  // For Acces National Pic
  const [nationalPic, setNationalPic] = useState("");

  // For Acces National Pic
  const [feePic, setFeePic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("email", email);
    userData.append("password", password);

    if (
      validMail === "valid" &&
      email !== "" &&
      validPassword === "valid" &&
      password !== "" &&
      name !== "" &&
      phone !== "" &&
      nationalID !== "" &&
      date !== "" &&
      profilePic !== "" &&
      nationalPic !== "" &&
      feePic !== "" &&
      gender !== "" &&
      level !== "" &&
      faculty !== ""
    ) {
      const data = new FormData();

      data.append("userName", name);
      data.append("email", email);
      data.append("password", password);
      data.append("faculty_id", faculty);
      data.append("gender", gender);
      data.append("level_id", level);
      data.append("national_id", nationalID);
      data.append("nationality_id", nationaltiy);
      data.append("birthDay", `${date}`);
      data.append("phoneNumber", phone);
      data.append("gov_id", gov);
      data.append("userImage_file", profilePic.files[0]);
      data.append("national_id_file", nationalPic.files[0]);
      data.append("fees_file", feePic.files[0]);
      dispatch(singupAPI({ data }))
        .unwrap()
        .then(() => {
          toast.success("برجاء مراجعة الايميل الجامعي لتفعيل حسابك");
        })
        .catch((error) => {
          const message =
            error?.message ||
            error?.error ||
            (typeof error === "string" ? error : null) ||
            "حدث خطاء اثناء انشاء الحساب برجاء التاكد من الايميل ثم اعادة المحاولة";
          toast.error(message);
        });
    } else {
      toast.error("برجاء استكمال البيانات المطلوبة");
    }
  };

  return (
    <div className="log-form">
      <div className="main-form">
        <div className="log-head">
          <h2>مرحبا بك في مستشفي جامعة حلوان</h2>
          <p>من فضلك انشى حساب لتسجيل الدخول</p>
        </div>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            className="karim-input"
            id="outlined-required"
            placeholder="الاسم كاملا"
            name="username"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <TextField
            fullWidth
            className="karim-input"
            id="outlined-required"
            placeholder="الايميل الجامعي"
            name="email"
            helperText={
              validMail === "error"
                ? "please enter a valid mail like a example@fci.helwan.edu.eg"
                : ""
            }
            value={email}
            onChange={(e) => {
              checkValidEmail(e.target.value);
            }}
            error={validMail === "error" ? true : false}
          />

          <FormControl variant="outlined">
            <OutlinedInput
              onChange={(e) => checkValidPassword(e.target.value)}
              placeholder="كلمة السر"
              value={password}
              name="password"
              id="outlined-adornment-password"
              fullWidth
              className="karim-input"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="start">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            {validPassword === "error" ? (
              <FormHelperText
                style={{ width: "320px", maxWidth: "100%" }}
                error
                id="component-helper-text"
              >
                Password should start with uppercase letter and should include
                lower letter and number and "@" OR "&"
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gender}
            className="karim-input"
            placeholder="dfsfd"
            displayEmpty
            onChange={handleGender}
          >
            <MenuItem value={``}>
              <p style={{ color: "#bfc2c8" }}>النوع</p>
            </MenuItem>
            <MenuItem value={`ذكر`}>ذكر</MenuItem>
            <MenuItem value={"انثي"}>انثي</MenuItem>
          </Select>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={nationaltiy}
            className="karim-input"
            placeholder="dfsfd"
            displayEmpty
            onChange={handleNationality}
          >
            <MenuItem value={``}>
              <p style={{ color: "#bfc2c8" }}>الجنسية</p>
            </MenuItem>
            <MenuItem value={1}>مصري</MenuItem>
            <MenuItem value={2}>وافد</MenuItem>
          </Select>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={faculty}
            className="karim-input"
            placeholder=""
            displayEmpty
            onChange={handleFaculty}
          >
            <MenuItem value={""}>
              {" "}
              <p style={{ color: "#bfc2c8" }}>اختار الكلية</p>{" "}
            </MenuItem>
            {FacultyData
              ? FacultyData.map((item) => {
                  return (
                    <MenuItem key={item.faculty_id} value={item.faculty_id}>
                      {" "}
                      {item.facultyName}{" "}
                    </MenuItem>
                  );
                })
              : ""}
          </Select>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={level}
            className="karim-input"
            placeholder=""
            displayEmpty
            onChange={handleLevel}
          >
            <MenuItem value={""}>
              {" "}
              <p style={{ color: "#bfc2c8" }}>اختار المستوي</p>{" "}
            </MenuItem>
            {levelData
              ? levelData.map((item) => {
                  return (
                    <MenuItem value={item.level_id}> {item.levelName}</MenuItem>
                  );
                })
              : ""}
          </Select>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gov}
            className="karim-input"
            placeholder=""
            displayEmpty
            onChange={handleGov}
          >
            <MenuItem value={""}>
              {" "}
              <p style={{ color: "#bfc2c8" }}>اختار المحافظة</p>{" "}
            </MenuItem>

            {govDat
              ? govDat.map((item) => {
                  return (
                    <MenuItem value={item.gov_id}> {item.govName} </MenuItem>
                  );
                })
              : ""}
          </Select>

          <TextField
            fullWidth
            className="karim-input"
            id="outlined-required"
            placeholder="الرقم القومي"
            name="national_id"
            value={nationalID}
            onChange={(e) => {
              setNationalID(e.target.value);
            }}
          />

          <TextField
            fullWidth
            className="karim-input"
            id="outlined-required"
            placeholder="الموبيل"
            name="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                "DatePicker",
                "TimePicker",
                "DateTimePicker",
                "DateRangePicker",
              ]}
            >
              <DatePicker
                className="karim-input"
                onChange={(e) => {
                  handleChangeDate(e.$D, e.$M, e.$y);
                  console.log(e);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <button className="upload-btn">
            {" "}
            <input
              onChange={(e) => setProfilePic(e.target.files[0])}
              type="file"
            />{" "}
            تحميل صورة شخصية{" "}
          </button>

          <button className="upload-btn">
            {" "}
            <input
              onChange={(e) => setNationalPic(e.target.files[0])}
              type="file"
            />{" "}
            تحميل صورة البطاقة{" "}
          </button>

          <button className="upload-btn">
            {" "}
            <input
              onChange={(e) => setFeePic(e.target.files[0])}
              type="file"
            />{" "}
            تحميل صورة الكانية او ثابات القيد{" "}
          </button>

          <Button
            style={{ margin: "20px 0px 50px 0px" }}
            fullWidth
            type="submit"
            className="log-btn"
            variant="contained"
            color="info"
          >
            {" "}
            انشاء{" "}
          </Button>
        </form>
      </div>

      <div className="image">
        <img src={maroPic} loading="lazy" alt="pic-doc" />
      </div>
    </div>
  );
};

export default Signup;
