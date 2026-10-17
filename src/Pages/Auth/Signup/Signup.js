import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../Login/Login.css";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
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
import { getAllGovernorates, getAllGovsAPI } from "../../../RTK/Governorate/GovernorateSlice";
import { getAllLevels, getAllLevelsAPI } from "./../../../RTK/Level/LevelSlice";
import DynamicFileUpload from "../../../Component/Utility/DynamicFileUpload";

const Signup = () => {
  // For Change Route
  const navigate = useNavigate();

  // For Dispatch Action
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFacultiesAPI());
    dispatch(getAllGovsAPI());
    dispatch(getAllLevelsAPI());
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

  const handleChangeDate = (newDate) => {
    if (newDate && typeof newDate.format === "function") {
      setDate(newDate.format("YYYY-MM-DD"));
    } else if (newDate) {
      try {
        const d = new Date(newDate);
        setDate(d.toISOString().split("T")[0]);
      } catch (e) {
        // ignore
      }
    } else {
      setDate("");
    }
  };

  // For Access Profile Pic
  const [profilePic, setProfilePic] = useState(null);

  // For Access National Pic
  const [nationalPic, setNationalPic] = useState(null);

  // For Access Fee Pic
  const [feePic, setFeePic] = useState(null);

  // Submission loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profilePic) {
      toast.error("يرجى تحميل الصورة الشخصية");
      return;
    }
    if (!nationalPic) {
      toast.error("يرجى تحميل صورة البطاقة");
      return;
    }
    if (!feePic) {
      toast.error("يرجى تحميل صورة الكارنيه أو إثبات القيد");
      return;
    }

    if (nationalID && (nationalID.length !== 14 || !/^\d{14}$/.test(nationalID))) {
      toast.error("الرقم القومي يجب أن يتكون من 14 رقماً");
      return;
    }

    if (phone && !/^01[0125][0-9]{8}$/.test(phone)) {
      toast.error("يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقماً");
      return;
    }

    if (
      validMail === "valid" &&
      email !== "" &&
      validPassword === "valid" &&
      password !== "" &&
      name !== "" &&
      phone !== "" &&
      nationalID !== "" &&
      date !== "" &&
      gender !== "" &&
      level !== "" &&
      faculty !== ""
    ) {
      setLoading(true);
      const data = new FormData();

      // Field names for backend validator and controller
      data.append("username", name);
      data.append("email", email);
      data.append("password", password);
      data.append("faculty_id", faculty);
      data.append("gender", gender);
      data.append("level_id", level);
      data.append("national_id", nationalID);
      data.append("nationality_id", nationaltiy);
      data.append("birth_date", `${date}`);
      data.append("phone_number", phone);
      data.append("gov_id", gov);

      // Multer registration upload field names
      data.append(
        "user_profile_photo",
        profilePic instanceof File ? profilePic : profilePic?.files?.[0] || profilePic
      );
      data.append(
        "national_id_file",
        nationalPic instanceof File ? nationalPic : nationalPic?.files?.[0] || nationalPic
      );
      data.append(
        "fees_file",
        feePic instanceof File ? feePic : feePic?.files?.[0] || feePic
      );

      dispatch(singupAPI({ data }))
        .unwrap()
        .then((res) => {
          setLoading(false);
          const registeredEmail = res?.email || email;
          toast.success(
            res?.message || "تم إنشاء الحساب بنجاح! برجاء تفقد بريدك الإلكتروني لإدخال رمز التحقق."
          );
          navigate("/verify-otp", { state: { email: registeredEmail } });
        })
        .catch((error) => {
          setLoading(false);
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
          <h2>أهلاً بيك في مستشفي جامعة حلوان 💙</h2>
          <p>من فضلك انشئ حساب لتسجيل الدخول</p>
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
            <MenuItem value={"أنثي"}>أنثى</MenuItem>
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
            displayEmpty
            onChange={handleFaculty}
          >
            <MenuItem value={""}>
              <p style={{ color: "#bfc2c8" }}>اختار الكلية</p>
            </MenuItem>
            {(Array.isArray(FacultyData) ? FacultyData : FacultyData?.value || []).map((item) => {
              const id = item.faculty_id ?? item.id;
              const label = item.facultyName ?? item.faculty_name;
              return (
                <MenuItem key={id} value={id}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={level}
            className="karim-input"
            displayEmpty
            onChange={handleLevel}
          >
            <MenuItem value={""}>
              <p style={{ color: "#bfc2c8" }}>اختار المستوي</p>
            </MenuItem>
            {(Array.isArray(levelData) ? levelData : levelData?.value || []).map((item) => {
              const id = item.level_id ?? item.id;
              const label = item.levelName ?? item.level_name;
              return (
                <MenuItem key={id} value={id}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gov}
            className="karim-input"
            displayEmpty
            onChange={handleGov}
          >
            <MenuItem value={""}>
              <p style={{ color: "#bfc2c8" }}>اختار المحافظة</p>
            </MenuItem>
            {(Array.isArray(govDat) ? govDat : govDat?.value || []).map((item) => {
              const id = item.gov_id ?? item.id;
              const label = item.govName ?? item.gov_name;
              return (
                <MenuItem key={id} value={id}>
                  {label}
                </MenuItem>
              );
            })}
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
            placeholder="الموبايل"
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
                onChange={(newVal) => {
                  handleChangeDate(newVal);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <DynamicFileUpload
            id="profile-pic-upload"
            label="تحميل صورة شخصية"
            sublabel="صورة شخصية رسمية واضحة (JPG, PNG)"
            icon="account_box"
            file={profilePic}
            onFileChange={setProfilePic}
            accept="image/*"
          />

          <DynamicFileUpload
            id="national-pic-upload"
            label="تحميل صورة البطاقة"
            sublabel="صورة بطاقة الرقم القومي (JPG, PNG, PDF)"
            icon="badge"
            file={nationalPic}
            onFileChange={setNationalPic}
            accept="image/*,.pdf"
          />

          <DynamicFileUpload
            id="fee-pic-upload"
            label="تحميل صورة الكارنيه أو إثبات القيد"
            sublabel="صورة كارنيه الكلية أو إيصال سداد المصروفات (JPG, PNG, PDF)"
            icon="receipt_long"
            file={feePic}
            onFileChange={setFeePic}
            accept="image/*,.pdf"
          />

          <Button
            style={{ margin: "20px 0px 15px 0px" }}
            fullWidth
            type="submit"
            className="log-btn"
            variant="contained"
            color="info"
            disabled={loading}
          >
            {loading ? "جاري إنشاء الحساب ورفع المستندات..." : "انشاء"}
          </Button>

          <div className="login-redirect-section">
            <span>لديك حساب بالفعل؟</span>
            <Link to="/login" className="login-redirect-link">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>

      <div className="image">
        <img src={maroPic} loading="lazy" alt="pic-doc" />
      </div>
    </div>
  );
};

export default Signup;
