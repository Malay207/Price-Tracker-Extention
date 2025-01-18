import React, { useEffect, useState } from 'react'
import './App.css';
const Trackitem = () => {
    const [User, setUser] = useState([]);
    const [Delete, setDelete] = useState("");

    const fetch_data = async (id: any) => {
        try {
           
            const response = await fetch(`https://chromeextention-backend-1.onrender.com/scrapp-data/get-scrap-data/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: null
            });
            const data = await response.json();
            
            return data;

        } catch (error) {
            console.error("Error fetching data: ", error);

        }
    }
    const delete_data = async (userid: any, dataid: any) => {
        try {
        const reponse = await fetch(`https://chromeextention-backend-1.onrender.com/scrapp-data/delete-scrap-data/${userid}/${dataid}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: null
        });
        const data = await reponse.json();
            
        } catch (error) {
            console.error("Error deleting data: ", error);
            
            
        }

    }
    useEffect(() => {
        chrome.storage.local.get("prictracker_userid", async (result) => {
            if (result.prictracker_userid) {
                const userdata = await fetch_data(result.prictracker_userid.user_id);
                setUser(userdata);
                setDelete(result.prictracker_userid.user_id);

            } else {
                console.log("No user id found in local storage");
            }
        })
    }, [User])

    return (
        <>
            <div className='trackitem-page'>
                <h2>Your Track items</h2>
                <div className='items'>
                    {
                        User.map((item: any, index: any) => {
                            return (
                                <div key={index} className='item-data'>
                                    <img src={item.image} alt="pdtimg..." className='item-img' />
                                    <a href={item.url} target='_blank' rel="noopener noreferrer" className='item-name'>{item.title.length > 6 ? item.title.substring(0, 6) + "..." : item.title}</a>
                                    <div className='item-price'>{`₹${item.price}`}</div>
                                    <img src="/images/delete.png" alt="Delete" className='item-remove' onClick={
                                        () => {
                                            delete_data(Delete, item._id);
                                            // eslint-disable-next-line no-self-compare
                                            setUser(User.filter((existingItem: any) => existingItem._id !== item._id));
                                        }
                                    } />
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </>
    )
}

export default Trackitem