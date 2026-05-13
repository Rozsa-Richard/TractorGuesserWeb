'use client'
import { Brand } from "@/types/brand";
import { Hint } from "@/types/hint";
import { Vehicle } from "@/types/vehicle";
import Image from 'next/image';
import { useState } from "react";
import { Col, Row } from "react-bootstrap";

const GameLogic = ({ todaysVehicle, defaultTractors, brands }: { todaysVehicle: Vehicle, defaultTractors: Vehicle[], brands: Brand[] }) => {
    const [query, setQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filteredItems, setFilteredItems] = useState<Array<Vehicle>>([]);
    const [tractors, setTractors] = useState<Array<Vehicle>>(defaultTractors);
    const [guessed, setGuessed] = useState<Array<Vehicle>>([]);
    const [hints, setHints] = useState<Array<Hint>>([]);
    const [isOver, setIsOver] = useState<boolean>(false);

    const decision = (tractor: number, guess: number) => {
        if (tractor == guess)
            return "correct";
        return tractor > guess ? "higher wrong" : "lower wrong";
    }

    const handleSelect = (guess: Vehicle) => {
        setQuery("");    
        setIsOpen(false);   

        if (guess.id == todaysVehicle.id){
            setHints([...hints, {
                id: guess.id,
                name: "correct",
                power: "correct",
                max_speed: "correct",
                price: "correct",
                brand: "correct",
                category: "correct",
                fuel_capacity: "correct",
            } as Hint]);
            setIsOver(true);
        }
        else {
            setHints([...hints, {
                id: guess.id,
                name: todaysVehicle.name == guess.name ? "correct" : "wrong",
                power: decision(todaysVehicle.power, guess.power),
                max_speed: decision(todaysVehicle.max_speed, guess.max_speed),
                price: decision(todaysVehicle.price, guess.price),
                brand: todaysVehicle.brandId == guess.brandId ? "correct" : "wrong",
                category: todaysVehicle.category == guess.category ? "correct" : "wrong",
                fuel_capacity: decision(todaysVehicle.fuel_capacity, guess.fuel_capacity), 
            } as Hint]);
        }
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
            </div> : <h3 className="text-center">Congratulation you guessed it!</h3>}

            <div>
                <Row className="text-center">
                    <Col className="column">Brand</Col>
                    <Col className="column">Name</Col>
                    <Col className="column">Category</Col>
                    <Col className="column">Horsepower</Col>
                    <Col className="column">Max Speed</Col>
                    <Col className="column">Price</Col>
                    <Col className="column">Fuel Capacity (l)</Col> 
                </Row>
                {guessed.length > 0 && (<>
                    {[...guessed].reverse().map(t => {
                        const hint = hints.find(a => a.id == t.id)!;
                        return <Row key={t.id} className="mt-3">
                                    <Col className="column"><div className={`infoBox ${hint.brand}`}><Image src={`/brands/${brands.find(b => b.id == t.brandId)?.image}`} alt={"logo"} width={150} height={150} style={{ objectFit: "contain" }}/></div></Col>
                                    <Col className="column"><div className={`infoBox ${hint.name}`}>{t.name}</div></Col>
                                    <Col className="column"><div className={`infoBox ${hint.category}`}>{t.category}</div></Col>
                                    <Col className="column"><div className={`infoBox ${hint.power}`}>{t.power}</div></Col>
                                    <Col className="column"><div className={`infoBox ${hint.max_speed}`}>{t.max_speed}</div></Col>
                                    <Col className="column"><div className={`infoBox ${hint.price}`}>{t.price}</div></Col>
                                    <Col className="column"><div className={`infoBox ${hint.fuel_capacity}`}>{t.fuel_capacity}</div></Col>
                                </Row>
                    })}
                </>)}
            </div>
        </div>
    )
}

export default GameLogic