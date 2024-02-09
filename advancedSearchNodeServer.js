const express = require('express');
const mysql = require('mysql2');

// Create connection
//You can sepparete this part of code to another file and import it here

const connection = mysql.createConnection({
    host: 'IP_ADDRESS',
    user: 'USERNAME',
    password: 'PASSWORD',
    database: 'DATEBASE_NAME',
    namedPlaceholders: true
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
})

// ------------------------------

//Endpoint for getting car offers
//You can choose what filter you want to use, what page you want to get and how many offers you want to get on one page
//Also you can choose beetwen sorting by price, date, mileage, year and power
app.get('/offers/search/:page', (req, res) => {
    const { page } = req.params;

    //You can choose 0 filters or all of them (25)
    const {
        brand, model, body, fuel, localization, seller, contract, registered, damaged, accident, country, usage, drive, gearbox,
        yearFrom, yearTo, priceFrom, priceTo, mileageFrom, mileageTo, horsepowerFrom, horsepowerTo, engineFrom, engineTo,
        sort
    } = req.query;
    const pageSize = 2;
    const status = 3;

    const offset = (page - 1) * pageSize;
    const end = offset + pageSize;

    let condition = "current_status = :status"

    if (mileageFrom) {
        condition += ` AND mileage >= ${mileageFrom}`;
    }

    if (mileageTo) {
        condition += ` AND mileage <= ${mileageTo}`;
    }

    if (priceFrom) {
        condition += ` AND price >= ${priceFrom}`;
    }

    if (priceTo) {
        condition += ` AND price <= ${priceTo}`;
    }

    if (yearFrom) {
        condition += ` AND production_year >= ${yearFrom}`;
    }

    if (yearTo) {
        condition += ` AND production_year <= ${yearTo}`;
    }

    if (horsepowerFrom) {
        condition += ` AND horsepower >= ${horsepowerFrom}`;
    }

    if (horsepowerTo) {
        condition += ` AND horsepower <= ${horsepowerTo}`;
    }

    if (engineFrom) {
        condition += ` AND engine_velocity >= ${engineFrom}`;
    }

    if (engineTo) {
        condition += ` AND engine_velocity <= ${engineTo}`;
    }

    if (brand) {
        condition += ` AND brand = ${brand}`;
    }

    if (model) {
        condition += ` AND model = ${model}`;
    }

    if (body) {
        condition += ` AND body = ${body}`;
    }

    if (fuel) {
        condition += ` AND fuel = ${fuel}`;
    }

    if (localization) {
        condition += ` AND localization = ${localization}`;
    }

    if (seller) {
        condition += ` AND seller_status = ${seller}`;
    }

    if (contract) {
        condition += ` AND contract = ${contract}`;
    }

    if (registered) {
        condition += ` AND is_registered = ${registered}`;
    }

    if (damaged) {
        condition += ` AND is_damaged = ${damaged}`;
    }

    if (accident) {
        condition += ` AND is_accident_free = ${accident}`;
    }

    if (country) {
        condition += ` AND country = ${country}`;
    }

    if (usage) {
        condition += ` AND is_used = ${usage}`;
    }

    if (drive) {
        condition += ` AND drive = ${drive}`;
    }

    if (gearbox) {
        condition += ` AND gearbox = ${gearbox}`;
    }

    if (sort) {
        switch (sort) {
            case "priceAsc":
            case "priceDesc":
                condition += ` ORDER BY price ${sort === "priceAsc" ? "ASC" : "DESC"}`;
                break;
            case "dateAsc":
            case "dateDesc":
                condition += ` ORDER BY created_at ${sort === "dateAsc" ? "ASC" : "DESC"}`;
                break;
            case "mileageAsc":
            case "mileageDesc":
                condition += ` ORDER BY mileage ${sort === "mileageAsc" ? "ASC" : "DESC"}`;
                break;
            case "yearAsc":
            case "yearDesc":
                condition += ` ORDER BY production_year ${sort === "yearAsc" ? "ASC" : "DESC"}`;
                break;
            case "powerAsc":
            case "powerDesc":
                condition += ` ORDER BY horsepower ${sort === "powerAsc" ? "ASC" : "DESC"}`;
                break;
        }
    }

    const query = `SELECT * FROM offers WHERE ${condition} LIMIT :offset, :end`;
    const values = {
        status: status,
        offset: offset,
        end: end
    }
    connection.query(query, values, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).end();
        }

        return res.status(200).json(result);
    });
})

//offers/search/:page from this enpoint you can get offers with filters and sorting
//This is example of response from this endpoint

// [
//     {
//         "id": 1,
//         "user_id": 1,
//         "created_at": "2024-02-07T23:01:12.000Z",
//         "activated_at": null,
//         "expire_at": "2024-03-08T23:01:12.000Z",
//         "current_status": 3,
//         "views": 0,
//         "clicks": 0,
//         "nickname": "Andrzej",
//         "phone_number": "333444555",
//         "localization": 1,
//         "brand": 2,
//         "model": 3,
//         "production_year": 2010,
//         "fuel": "petrol",
//         "gearbox": "manual",
//         "mileage": 123123,
//         "body": "coupe",
//         "seller_status": 0,
//         "contract": 0,
//         "is_registered": 0,
//         "is_accident_free": 1,
//         "is_damaged": 1,
//         "country": 10,
//         "is_used": 1,
//         "price_negotiable": 0,
//         "price": 123321,
//         "car_description": "XYZ",
//         "profile_image": "1-1707346872276-610513888.jpg",
//         "image": {
//             "image1": "image1.jpg",
//             "image2": "image2.jpg"
//         },
//         "vin": "AAA1223",
//         "engine_velocity": 2000,
//         "horsepower": 123,
//         "drive": "fwd",
//         "doors": "3",
//         "color": "white",
//         "registration_number": "XYZ75643",
//         "first_registration": "2007-03-01T23:00:00.000Z",
//         "equipment": {
//             "eq": "Radio",
//             "eq2": "ABS"
//         }
//     }
// ]


