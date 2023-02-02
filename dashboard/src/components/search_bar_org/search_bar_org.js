import React, { Component } from 'react';

const SearchBarOrg = (props) => {
    const search = props.search;
    const setSearch = props.setSearch;
    const searchUser = props.searchUser;

    

    return (
        <div action="" class="search-bar">
            <input type="search" name="search" pattern=".*\S.*" onChange={e => setSearch(e.target.value)} value={search} required/>
            <button class="search-btn" onClick={e => searchUser()}>
                <span>Search</span>
            </button>
        </div>
    );
};

export default SearchBarOrg;
