/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Form } from 'react-bootstrap';
import Category from '../../model/Category/category';
import PopulatedTransaction from '../../model/Transaction/populatedTransaction';

// eslint-disable-next-line max-len
const CategoryDropdown = ({ categories, isDeposit, onCategorySelect, setIsDeposit, currentTrans }:
     // eslint-disable-next-line max-len
     { categories:Category[], isDeposit?:boolean, onCategorySelect:any, setIsDeposit: React.Dispatch<React.SetStateAction<boolean>> , currentTrans:PopulatedTransaction | null}) => 
{
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

    useEffect(() => 
    {
        setFilteredCategories(categories.filter((category) => category.isDeposit === isDeposit));
    }, [categories, isDeposit]);

    const handleCategorySelect = (category:Category | null) => 
    {
        setSelectedCategory(category);
        onCategorySelect(category?._id);
    };

    return (
        <div>
            <Form.Check
                type="checkbox"
                label='isDeposit'
                checked={isDeposit}
                onChange={() => setIsDeposit(!isDeposit)}
                className="custom-checkbox"
                id="isDepositCheckbox"
            />

            <Dropdown className='cat-dropdown'>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {
                        selectedCategory ? (
                            <>
                                {selectedCategory.name}{' '}
                                <Button className='dropdown-btn' variant="light" size="sm" onClick={() => handleCategorySelect(null)}>X</Button>
                            </>
                        ) : 
                            currentTrans ?
                                (
                                    currentTrans?.categoryId.name
                                ):
                                (
                                    'Select Category'
                                )
                    
                    }
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {filteredCategories.map((category) => (
                        <Dropdown.Item
                            key={category._id}
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category.name}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default CategoryDropdown;
