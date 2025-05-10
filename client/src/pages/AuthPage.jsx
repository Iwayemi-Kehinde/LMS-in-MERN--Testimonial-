import React from "react"
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa"
import styled from "styled-components"

const AuthPage = () => {
    const [isLogin, setIsLogin] = React.useState(false)
    return (
        <Container>
            {isLogin ? (
                <div>
                    <h3>Login to ELearning</h3>
                    <InputContainer>
                        <p>Email: </p>
                        <input type="email" placeholder="Input your Email" />
                    </InputContainer>

                    <InputContainer>
                        <p>Password: </p>
                        <input type="password" placeholder="Input your Password" />
                    </InputContainer>
                    <span style={{ position: "absolute", right: "20px", marginTop: "15px", cursor: "pointer" }}>Forgot my Password ?</span>
                    <hr style={{ marginTop: "85px" }} />
                    <section style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ marginRight: "10px" }}>Or Sign In with </p>
                        <p>
                            <FaGoogle style={{ verticalAlign: "middle", marginRight: "10px" }} />
                            <FaGithub style={{ verticalAlign: "middle", marginRight: "10px" }} />
                            <FaFacebook style={{ verticalAlign: "middle" }} />
                        </p>

                    </section>
                    <p style={{ marginTop: "23px" }}>Don't have an account ? <SignUpButton onClick={() => setIsLogin(!isLogin)}>Sign Up</SignUpButton></p>
                </div>
            ) :
                <div>
                    <h3>SignUp to ELearning</h3>
                    <InputContainer>
                        <p>FullName: </p>
                        <input type="text" placeholder="Input your fullname" />
                    </InputContainer>

                    <InputContainer>
                        <p>Email: </p>
                        <input type="email" placeholder="Input your Email" />
                    </InputContainer>

                    <InputContainer>
                        <p>Password: </p>
                        <input type="password" placeholder="Input your Password" />
                    </InputContainer>
                    <hr style={{ marginTop: "25px" }} />
                    <section style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ marginRight: "10px" }}>Or Sign Up with </p>
                        <p>
                            <FaGoogle style={{ verticalAlign: "middle", marginRight: "10px" }} />
                            <FaGithub style={{ verticalAlign: "middle", marginRight: "10px" }} />
                            <FaFacebook style={{ verticalAlign: "middle" }} />
                        </p>

                    </section>
                    <p style={{ marginTop: "23px" }}>Had an account ? <SignUpButton onClick={() => setIsLogin(!isLogin)}>Sign In</SignUpButton></p>
                </div>
            }
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: lightgrey;
    padding: 14px;

    div {
        position: relative;
        padding: 20px;
        background: white;
        width: 420px;
        height: 420px;
        border-radius: 8px;
        @media(max-width: 768px) {
            padding: 12px;
        }
    }
    h3{
        text-align: center;
        margin-top: 12px;
        color: purple;
        margin-bottom: 22px;
    }
`

const InputContainer = styled.section`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 17px;
    input {
    padding: 4px;
    border: 1px solid lightgrey;
    outline: none;
    &:focus {
        border: 1px solid lightblue;
       }
       transition: border .6s;
   }
`

const SignUpButton = styled.button`
color: purple;
border: none;
font-weight: bold;
background: white;
font-size: 15px;
margin-left: 4px;
cursor: pointer;
`

export default AuthPage