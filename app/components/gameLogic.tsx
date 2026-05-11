'use client'
import { getVehicles } from "@/data/data";
import { Vehicle } from "@/types/vehicle";
import Image from 'next/image';
import { useState } from "react";
import { Col, Row } from "react-bootstrap";

const GameLogic = () => {
    const [query, setQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filteredItems, setFilteredItems] = useState<Array<Vehicle>>([]);
    const [tractors, setTractors] = useState<Array<Vehicle>>(getVehicles());
    const [guessed, setGuessed] = useState<Array<Vehicle>>([]);

    const handleSelect = (item: Vehicle) => {
        setQuery("");    
        setGuessed([...guessed, item]);
        setTractors(tractors.filter(i => i != item));
        setIsOpen(false);   
  };

    return (
        <div className="m-auto col-10">
            <div className="position-relative" style={{ width: '300px' }}>
                <label htmlFor="searchSelect" className="form-label fw-bold">
                    Keresés a listában
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
                                const str = item.brand +" "+ item.name;
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
                    {filteredItems.map((item, index) => (
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
                            {item.name}
                        </li>
                    ))}
                    </ul>
                )}

                {isOpen && filteredItems.length === 0 && (
                    <ul className="list-group position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1050 }}>
                    <li className="list-group-item text-muted text-center">Nincs találat</li>
                    </ul>
                )}
            </div>

            <div>
                <Row>
                    <Col xs={2}>Brand</Col>
                    <Col xs={2}>Name</Col>
                    <Col xs={2}>Category</Col>
                    <Col xs={2}>Horsepower</Col>
                    <Col xs={2}>Max Speed</Col>
                    <Col xs={2}>Fuel Capacity (l)</Col>
                </Row>
                {guessed.length > 0 ? (<>
                    {guessed.map(t => (<Row key={t.id}>
                        <Col xs={2}>{t.brand}</Col>
                        <Col xs={2}>{t.name}</Col>
                        <Col xs={2}>{t.category}</Col>
                        <Col xs={2}>{t.power}</Col>
                        <Col xs={2}>{t.max_speed}</Col>
                        <Col xs={2}>{t.fuel_capacity}</Col>
                    </Row>))}
                </>) : (<div>

                </div>)}
            </div>
        </div>
    )
}

export default GameLogic