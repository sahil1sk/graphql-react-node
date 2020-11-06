import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

class BookingsPage extends Component{
    
    state = {
        isLoading: false,
        bookings: []
    }

    isActive = true;

    static contextType = AuthContext;

    componentDidMount(){
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({isLoading:true});
        
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(resData => {
            const bookings = resData.data.bookings;
            if(this.isActive){
                this.setState({bookings: bookings, isLoading:false});
            }
        })
        .catch(err => {
            this.setState({isLoading:false});
            console.log(err);
        });
    }
    
    componentWillUnmount(){
        this.isActive = false;
    }

    render(){
        return(
            <>
            {this.state.isLoading ?
                <Spinner />
            :
                <ul>
                    {this.state.bookings.map(booking => {
                        return <li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}</li>
                    })}
                </ul>
            }
            </>
        );
    }
}

export default BookingsPage;