import React, { useEffect, useState } from 'react';
import './App.css';
import { ColorRing } from "react-loader-spinner"

const HomePage = () => {
    const [Url, setUrl] = useState("");
    const [homepageloading, sethomepageloading] = useState(false)
    useEffect(() => {
        //get the url from active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const cur_tab_url = tabs[0].url;
            if (cur_tab_url) {
                setUrl(cur_tab_url || "");
            }
        });

    }, [])
    function createnotification(message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const opt: any = {
                type: 'list',
                title: 'Price-Tracker message',
                message: "product added successfully",
                items: [{ title: 'Price-Tracker message', message: message }],
                iconUrl: '/images/icon128.png'
            };

            // Create the notification
            chrome.notifications.create('notify1', opt, (notificationId) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message)); // Reject the promise if there's an error
                } else {
                    console.log("Notification created with ID:", notificationId);
                    resolve(); // Resolve the promise if the notification is created successfully
                }
            });
        });
    }


    const fetchdata = async (url: string, user_id: string) => {
        try {
            sethomepageloading(true);
            const response = await fetch("https://chromeextention-backend-1.onrender.com/scrapp-data/add-scrap-data", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, user_id })
            });
            const data = await response.json();
            if (data) {
                console.log(data.message);
                await createnotification(data.message);

            }

        }
        catch (error) {
            console.error(error)
        }
        finally {
            sethomepageloading(false);
        }

    }

    return (
        <>
            {
                homepageloading && <div style={{
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
            }
            <div className='main-page'>
                <h2>Track your Product</h2>
                {/* description about extension */}
                <div className='headline'>
                    <p>Track Product Prices and Get Notified on Price Drops Across these Websites</p>
                    <div className='headline-img'>
                        <img src="/images/fk.png" alt="Flipkart" />
                        <img src="/images/am.png" alt="Amazone" />
                        <img src="/images/ajio.png" alt="Ajio" />
                    </div>
                </div>

                {/* search box for tracking the product */}
                <div className='product-track'>
                    <input type="url" value={Url} readOnly placeholder="Search for products..." />
                    <button onClick={
                        async () => {
                            // replace with user id from local storage or database
                            chrome.storage.local.get("prictracker_userid", async (result) => {
                                await fetchdata(Url, result.prictracker_userid.user_id);
                            });
                            setUrl("");
                        }
                    }>Track</button>
                </div>


            </div>

        </>
    )
}

export default HomePage