import React, { useState } from 'react'
import './App.css';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from "react-loader-spinner"
const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [Signupdata, setSignupdata] = useState({
        name: '',
        email: '',
        password: ''
    });
    const onchange = (e: any) => {
        setSignupdata({ ...Signupdata, [e.target.name]: e.target.value })
    }
    const onclick = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await fetch("https://chromeextention-backend-1.onrender.com/scrapp-data/create-user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (data) {
                chrome.storage.local.set({
                    "prictracker_userid": {
                        user_id: data.newUser._id,
                        name: data.newUser.name
                    }
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        // After setting the storage, navigate to the home page
                        setTimeout(() => {
                            navigate('/');
                        }, 2000);
                    }

                })
            }

        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className='signup-form'>
                <h2>Sign Up</h2>
                {isLoading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}><ColorRing
                            visible={true}
                            height="30"
                            width="30"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}

                        /></div>
                )}
                <form>
                    <div className='form-input'>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" onChange={onchange} value={Signupdata.name} required minLength={4} />
                    </div>
                    <br />
                    <div className='form-input'>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" onChange={onchange} required value={Signupdata.email} />
                    </div>
                    <br />
                    <div className='form-input'>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" onChange={onchange} required minLength={4} value={Signupdata.password} />
                    </div>
                    <button type="submit" onClick={
                        async () => {
                            onclick(Signupdata.name, Signupdata.email, Signupdata.password);
                            setSignupdata({ name: '', email: '', password: '' });
                        }
                    } disabled={isLoading}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}</button>
                </form>

            </div>
        </>
    )
}

export default Signup