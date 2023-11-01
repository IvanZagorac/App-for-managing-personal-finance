import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Form } from 'react-bootstrap';
import Category from '../../model/category';

// eslint-disable-next-line max-len
const CategoryDropdown = ({ categories, isDeposit, onCategorySelect, setIsDeposit }:
     // eslint-disable-next-line max-len
     { categories:Category[], isDeposit:boolean, onCategorySelect:any, setIsDeposit: React.Dispatch<React.SetStateAction<boolean>>}) => 
{
    const [selectedCategory, setSelectedCategory] = useState<Category>({
        _id: '',
        name: '',
        isDeposit: false,
    });

    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

    useEffect(() => 
    {
        setFilteredCategories(categories.filter((category) => category.isDeposit === isDeposit));
    }, [categories, isDeposit]);

    const handleCategorySelect = (category:Category) => 
    {
        setSelectedCategory(category);
        onCategorySelect(category._id);
    };

    return (
        <div>
            <Form.Check
                type="checkbox"
                label='isDeposit'
                checked={isDeposit}
                onChange={() => setIsDeposit(!isDeposit)}
            />

            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedCategory ? selectedCategory.name : 'Select Category'}
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
