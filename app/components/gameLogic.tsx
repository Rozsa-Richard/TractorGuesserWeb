'use client'
import Image from 'next/image';
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import { Vehicle } from "@/types/vehicle";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";


const GameLogic = ({ todaysVehicle, defaultTractors, brands, date } : { todaysVehicle: Vehicle, defaultTractors: Vehicle[], brands: Brand[], date: string, }) => {
    const [query, setQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filteredItems, setFilteredItems] = useState<Array<Vehicle>>([]);
    const [tractors, setTractors] = useState<Array<Vehicle>>(defaultTractors);
    const [guessed, setGuessed] = useState<Array<Vehicle>>([]);
    const [isOver, setIsOver] = useState<boolean>(false);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [measure, setMeasure] = useState<boolean>(false);
    const [money, setMoney] = useState<string>("€");

    useEffect(() => {
        const lastDate = localStorage.getItem("lastDate");
        if (lastDate == date) {
            const tips = JSON.parse(localStorage.getItem("tips") ?? "[]");
            if (tips){
                setGuessed(defaultTractors.filter(t => tips.includes(t.id)));
                setTractors(tractors.filter(t => !tips.includes(t.id)));
                if (tips.includes(todaysVehicle.id))
                    setIsOver(true);
            }
            setLoaded(true);
        }
        else 
            localStorage.setItem("lastDate",date);
    },[]);

    useEffect(() => {
        setMeasure((localStorage.getItem("measure") ?? "1") == "1");
        setMoney(localStorage.getItem("money") ?? "€");
    },[query]);

    useEffect(() => {
        if (loaded)
            localStorage.setItem("tips",JSON.stringify(guessed.map(g => g.id)));
    },[guessed]);

    const higherOrLower = (tractor: number, guess: number) => {
        if (tractor == guess)
            return "correct";
        return tractor < guess ? "lower wrong" : "higher wrong";
    };

    const isItCorrect = (tractor: any, guess: any) => tractor == guess ? "correct" : "wrong";

    const handleSelect = (guess: Vehicle) => {
        setQuery("");    
        setIsOpen(false);   
        if (guess.id == todaysVehicle.id)
            setIsOver(true);
        setGuessed([...guessed, guess]);
        setTractors(tractors.filter(i => i != guess));
    };

    return (
        <div className="m-auto col-lg-10 col-xl-8">
            {!isOver ? <div className="position-relative" style={{ width: '300px' }}>
                <label htmlFor="searchSelect" className="form-label fw-bold">
                    Take a guess!
                </label>
                
                <input
                    type="text"
                    className="form-control"
                    value={query}
                    onChange={(e) => {
                        const value = e.target.value;
                        setQuery(value);

                        if (value.length >= 1) {
                            const filtered = tractors.filter((item) => {
                                const brand = brands.find(b => b.id == item.brandId);
                                const str = brand?.name +" "+ item.name;
                                return str.toLowerCase().includes(value.toLowerCase())
                            });
                            setFilteredItems(filtered);
                            setIsOpen(true);
                        } else {
                            setFilteredItems([]);
                            setIsOpen(false);
                        }}
                    }
                    autoComplete="off"
                />

                {isOpen && filteredItems.length > 0 && (
                    <ul 
                    className="list-group position-absolute w-100 mt-1 shadow-sm"
                    style={{ 
                        maxHeight: '200px', 
                        overflowY: 'auto', 
                        zIndex: 1050 
                    }}
                    >
                    {filteredItems.map((item, index) => {
                        const brand = brands.find(b => b.id == item.brandId)?.name;
                        return (
                            <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSelect(item)}
                            >
                                {item.image ? <Image
                                    src={item.image}
                                    alt=""
                                    width={50}
                                    height={50}
                                    className="rounded-circle" 
                                /> : (<></>)}
                                {brand + " " +item.name}
                            </li>
                        )})}
                    </ul>
                )}

                {isOpen && filteredItems.length === 0 && (
                    <ul className="list-group position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1050 }}>
                        <li className="list-group-item text-muted text-center">Not found</li>
                    </ul>
                )}
            </div> : <div className='text-center'>
                    <h3>Congratulation, you guessed it!</h3>
                    Come back tomorow for the next puzzle
                </div>}

            <div>
                <Row className="text-center">
                    <Col className="column">Brand</Col>
                    <Col className="column">Name</Col>
                    <Col className="column">Category</Col>
                    <Col className="column">Horsepower</Col>
                    <Col className="column">Max Speed</Col>
                    <Col className="column">Price</Col>
                    <Col className="column">Fuel Capacity</Col> 
                </Row>
                {guessed.length > 0 && (<>
                    {[...guessed].reverse().map(t => <Row key={t.id} className="mt-3">
                                    <Col className="column"><div className={`infoBox ${isItCorrect(t.brandId,todaysVehicle.brandId)}`}><Image src={`/brands/${brands.find(b => b.id == t.brandId)?.image}`} alt={"logo"} width={150} height={150} style={{ objectFit: "contain" }}/></div></Col>
                                    <Col className="column"><div className={`infoBox ${isItCorrect(t.name,todaysVehicle.name)}`}>{t.name}</div></Col>
                                    <Col className="column"><div className={`infoBox ${isItCorrect(t.category,todaysVehicle.category)}`}>{Category[t.category]}</div></Col>
                                    <Col className="column"><div className={`infoBox ${higherOrLower(t.power, todaysVehicle.power)}`}>{t.power}</div></Col>
                                    <Col className="column"><div className={`infoBox ${higherOrLower(t.max_speed,todaysVehicle.max_speed)}`}>{measure ? (t.max_speed/8)*5 + " mp/h" : t.max_speed + "km/h"}</div></Col>
                                    <Col className="column"><div className={`infoBox ${higherOrLower(t.price, todaysVehicle.price)}`}>{t.price} {money}</div></Col>
                                    <Col className="column"><div className={`infoBox ${higherOrLower(t.fuel_capacity, todaysVehicle.fuel_capacity)}`}>{t.fuel_capacity} l</div></Col>
                                </Row>)}
                </>)}
            </div>
        </div>
    )
}

export default GameLogic