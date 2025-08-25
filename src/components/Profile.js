import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Image } from "react-bootstrap";
import Sidebar from "./Sidebar";
import ProfileForm from "./ProfileForm";
import { ThemeContext } from "./Context/ThemeContext";

const Profile = (props) => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profile, setProfile] = useState([]);
  const [editProfile, setEditProfile] = useState(null);

  const { theme } = useContext(ThemeContext);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:4002/profile/getprofile", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      console.log(data.profile);
      setProfile(data.profile);
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = (profileData) => {
    setEditProfile(profileData);
    setShowProfileForm(true);
  };

  return (
    <div>
      <Container>
        <Sidebar onLogout={props.onLogout} />
      </Container>
      <Container>
        {showProfileForm && (
          <ProfileForm
            closeHandler={() => setShowProfileForm(false)}
            onAdded={(newProfile) =>
              setProfile((prev) => [...prev, newProfile])
            }
            editProfile={editProfile}
          />
        )}
        <div
          style={{
            marginTop: "1%",
            width: "100%",
            marginLeft: "0%",
          }}
        >
          {profile && profile.length > 0 ? (
            profile.map((profile) => (
              <div style={{ paddingBottom: "1rem" }}>
                <div style={{ paddingBottom: "1rem" }}>
                  <h1 style={{ marginLeft: "1.5%", marginTop: "1%" }}>
                    Personal Information
                  </h1>
                  <Card
                    style={{
                      width: "97%",
                      marginLeft: "1%",
                      marginTop: "1%",
                      display: "flex",
                      flexDirection: "row",
                      gap: "3%",
                      height: "30vh",
                    }}
                  >
                    <Image
                      style={{
                        width: "10%",
                        height: "20vh",
                        // border: "1px solid green",
                        marginLeft: "2%",
                        marginTop: "2.5%",
                      }}
                      src={
                        profile.photo
                          ? profile.photo
                          : "https://i.pinimg.com/736x/b1/e1/97/b1e197615b913f5d61323652ae1a59fd.jpg"
                      }
                      roundedCircle
                    />
                    <div>
                      <h1 style={{ paddingTop: "2rem" }}>
                        {profile.User?.name}
                      </h1>
                      <h5>
                        Date of Birth:{" "}
                        {profile.dateofbirth
                          ? profile.dateofbirth
                          : "No Date of Birth added yet"}
                      </h5>
                      <h5>
                        {profile.summary
                          ? profile.summary
                          : "No Summary added yet."}
                      </h5>
                    </div>
                    <Button
                      style={{
                        height: "5vh",
                        marginTop: "5rem",
                        marginLeft: "37rem",
                      }}
                      onClick={() => handleEdit(profile)}
                      variant="outline-dark"
                    >
                      Edit Profile +
                    </Button>
                  </Card>
                  <div
                    style={{
                      display: "flex",
                      gap: "1%",
                      flexDirection: "row",
                      // border: "1px solid blue",
                      marginLeft: "1%",
                      marginTop: "2%",
                      width: "97%",
                    }}
                  >
                    <div>
                      <h1 style={{ marginLeft: "1.5%" }}>Contact Details</h1>
                      <Card
                        style={{
                          marginTop: "1%",
                          marginLeft: "0%",
                          height: "30vh",
                          width: "40rem",
                        }}
                      >
                        <div style={{ marginLeft: "2%", marginTop: "2%" }}>
                          <h4>Email: {profile.User?.email}</h4>
                          <h4>
                            Phone Number:{" "}
                            {profile.phone
                              ? profile.phone
                              : "No Phone Number is added yet"}
                          </h4>
                          <h4>
                            Address:{" "}
                            {profile.address
                              ? profile.address
                              : "No Address is added yet"}
                          </h4>
                        </div>
                      </Card>
                    </div>
                    <div>
                      <h1 style={{ marginLeft: "1.5%" }}>Career Goals</h1>
                      <Card
                        style={{
                          marginTop: "1%",
                          marginLeft: "1%",
                          height: "30vh",
                          width: "37.3rem",
                        }}
                      >
                        <div style={{ marginLeft: "2%", marginTop: "2%" }}>
                          <h5>
                            {profile.careergoals
                              ? profile.careergoals
                              : "No Goals are added yet"}
                          </h5>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <h3>No profile added yet.</h3>
              <Button
                onClick={() => setShowProfileForm(true)}
                variant={theme === "light" ? "outline-dark" : "outline-light"}
              >
                Add Profile +
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Profile;
