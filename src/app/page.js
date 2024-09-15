"use client"

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import Image from 'next/image';
import Logo from "./images/Logo.png"
import Vector from "./images/Vector.png"
import DefaultImage from "./images/Default.png"
import Dateret from "./images/Dateret.png"
import Class from "./images/Class.png"

async function fetchData(query = 'check', page = 1) {
  const itemsPerPage = 10;
  const requestBody = {
    input_query: query,
    input_query_type: "",
    sort_by: "default",
    status: [],
    exact_match: false,
    date_query: false,
    owners: [],
    attorneys: [],
    law_firms: [],
    mark_description_description: [],
    classes: [],
    page: page,
    rows: itemsPerPage,
    sort_order: "desc",
    states: [],
    counties: [],
  };

  try {
    const response = await axios.post(
      'https://vit-tm-task.api.trademarkia.app/api/v3/us',
      requestBody,
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'content-type': 'application/json',
        },
      }
    );

    const hits = response.data.body.hits.hits;
    const totalHits = response.data.body.hits.total.value;
    const totalPages = Math.ceil(totalHits / itemsPerPage);
    const aggregations = response.data.body.aggregations;

    return { hits, totalHits, totalPages, aggregations };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { hits: [], totalHits: 0, totalPages: 0, aggregations: {} };
  }
}

export default function Home({ searchParams }) {
  const { searchQuery = 'check', page = 1 } = searchParams;
  const [query, setQuery] = useState(searchQuery);
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState('Searching...');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [selectedOption, setSelectedOption] = useState('owners');
  const [filterList, setFilterList] = useState([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [totalPages, setTotalPages] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [aggregations, setAggregations] = useState({});

  const [activeTab, setActiveTab] = useState('Owners');
  const tabs = ['Owners', 'Law Firms', 'Attorneys'];


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Owners") {
      setFilterList(aggregations.current_owners?.buckets || []);
    } else if (tab === "Law Firms") {
      setFilterList(aggregations.law_firms?.buckets || []);
    } else if (tab === "Attorneys") {
      setFilterList(aggregations.attorneys?.buckets || []);
    }
    setFilterSearch("");
  };

  const handleSearch = useCallback(async (query = 'check', page = 1) => {
    setStatus('Searching...');
    const { hits, totalHits, totalPages, aggregations } = await fetchData(query, page);

    setFilteredData(hits);
    setTotalHits(totalHits);
    setTotalPages(totalPages);
    setStatus(totalHits > 0 ? '' : 'No Results Found');
    setCurrentPage(page);
    setAggregations(aggregations);

    if (activeTab === "Owners") {
      setFilterList(aggregations.current_owners?.buckets || []);
    } else if (activeTab === "Law Firms") {
      setFilterList(aggregations.law_firms?.buckets || []);
    } else if (activeTab === "Attorneys") {
      setFilterList(aggregations.attorneys?.buckets || []);
    }
  }, [activeTab]);

  useEffect(() => {
    handleSearch(query || 'check', currentPage);
  }, [handleSearch, query, currentPage]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === 'All') {
      setFilteredData(filteredData);
    } else {
      const lowerCaseStatus = status.toLowerCase();
      const filtered = filteredData.filter((item) =>
        item._source.status_type.toLowerCase() === lowerCaseStatus
      );
      setFilteredData(filtered);
    }
  };

  // const handleOptionFilter = (option) => {
  //   setSelectedOption(option);
  // };

  const handleCheckboxChange = (name) => {
    const updatedSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];

    setSelectedItems(updatedSelectedItems);

    const filtered = filteredData.filter((item) =>
      updatedSelectedItems.includes(item._source[selectedOption])
    );
    setFilteredData(updatedSelectedItems.length ? filtered : filteredData);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (page) => {
    handleSearch(query || 'check', page);
  };

  const filteredList = filterList.filter((item) =>
    item.key.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const getPaginationPages = () => {
    const pages = [];
    const total = totalPages;

    if (total <= 1) return pages;

    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }

    pages.push(currentPage);

    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
    }

    if (totalPages > currentPage + 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src={Logo}
            alt="Logo"
            fill
          />
        </div>
        <div className={styles.searchBar}>
          <div className={styles.searchLine}>
            <div className={styles.vector}>
              <Image
                src={Vector}
                alt="Logo"
                fill
              />
            </div>
            <input
              type="text"
              placeholder="Search Trademark Here eg. Mickey Mouse"
              value={query}
              className={styles.searchInput}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={() => handleSearch(query || 'check', 1)}>Search</button>
        </div>
        {status && <div className={styles.statusIndicator}>{status}</div>}
      </header>

      <p className={styles.number}>
        About <span className={styles.spna}>{totalHits}</span> Trademarks found for <span className={styles.spna}>{query || 'your search term'}</span>
      </p>
      <div className={styles.dummyline}></div>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.row}>
            <div className={styles.cell1}><span className={styles.mar}>Mark</span></div>
            <div className={styles.cell2}><span className={styles.mar}>Details</span></div>
            <div className={styles.cell3}><span className={styles.mar}>Status</span></div>
            <div className={styles.cell4}><span className={styles.mar}>Class/Description</span></div>
          </div>
          <div className={styles.results}>
            {filteredData?.map((item, index) => {
              const source = item._source;
              const randomDate1 = "26th Jan 2020";
              const randomDate2 = "18th Aug 2021";
              const randomDate3 = "12th Dec 2021";

              return (
                <div key={index} className={styles.resultTable}>
                  <div className={styles.row}>
                    <div className={styles.cell1}>
                      <div className={styles.defaultImage}>
                        <Image src={DefaultImage} alt="Default" fill className={styles.defImg} />
                      </div>
                    </div>
                    <div className={styles.cell2}>
                      <div className={styles.cell2top}>
                        <p className={styles.markIdenty}>{source.mark_identification}</p>
                        <p>{source.current_owner}</p>
                      </div>
                      <p className={styles._id}>ID: {item._id}</p>
                      <p>{randomDate1}</p>
                    </div>
                    <div className={styles.cell3}>
                      <div className={styles.cell3top}>
                        <div className={styles.cell3topflex}>
                          <div
                            className={styles.stacircle}
                            style={{
                              backgroundColor:
                                source.status_type === 'registered' ? '#52B649' :
                                  source.status_type === 'pending' ? '#ECC53C' :
                                    source.status_type === 'abandoned' ? '#EC3C3C' : 'blue',
                              height: '10px',
                              width: '10px',
                              borderRadius: '50%'
                            }}
                          />
                          <p
                            className={styles.stap}
                            style={{
                              color:
                                source.status_type === 'registered' ? '#52B649' :
                                  source.status_type === 'pending' ? '#ECC53C' :
                                    source.status_type === 'abandoned' ? '#EC3C3C' : 'blue',
                            }}
                          >
                            {source.status_type}
                          </p>
                        </div>
                        <p>on <span className={styles.cell3span}>{randomDate2}</span></p>
                      </div>
                      <div className={styles.retdate}>
                        <div className={styles.dateretdiv}>
                          <Image src={Dateret} alt="Default" fill className={styles.dateret} />
                        </div>
                        <span className={styles.cell3span}>{randomDate3}</span>
                      </div>
                    </div>

                    <div className={styles.cell4}>
                      <div className={styles.cell4top}>
                        <p>
                          {source.mark_description_description[0].slice(0, 80)}
                          {source.mark_description_description[0].length > 80 && '...'}
                        </p>
                      </div>
                      <div className={styles.classcodes}>
                        {source.class_codes.slice(0, 3).map((code, index) => (
                          <div className={styles.class} key={index}>
                            <div className={styles.classimg}>
                              <Image src={Class} alt="Class" fill className={styles.dateret} />
                            </div>
                            class {parseInt(code, 10)}
                          </div>
                        ))}
                        {source.class_codes.length > 3 && (
                          <div className={styles.moreClassCodes}>
                            <button className={styles.moreButton}>...</button>
                            <div className={styles.tooltip}>
                              {source.class_codes.slice(3).map((code, index) => (
                                <div className={styles.class} key={index}>
                                  <div className={styles.classimg}>
                                    <Image src={Class} alt="Class" fill className={styles.dateret} />
                                  </div>
                                  class {parseInt(code, 10)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            <div className={styles.pagination}>
              {currentPage > 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
              )}

              {getPaginationPages().map((page, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? styles.active : ''}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages && (
                <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
              )}
            </div>

            <div className={styles.totalPages}>
              <p>Total Pages: {totalPages}</p>
            </div>
          </div>
        </div>
        <div className={styles.filters}>
          <div className={styles.status}>
            <p className={styles.phead}>Status</p>
            <button
              onClick={() => handleStatusFilter('All')}
              className={statusFilter === 'All' ? styles.selected : ''}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('Registered')}
              className={statusFilter === 'Registered' ? styles.selected : ''}
            >
              <div className={styles.stabtn}><div className={styles.circlegreen}></div><p>Registered</p></div>
            </button>
            <button
              onClick={() => handleStatusFilter('Pending')}
              className={statusFilter === 'Pending' ? styles.selected : ''}
            >
              <div className={styles.stabtn}><div className={styles.circleyellow}></div><p>Pending</p></div>
            </button>
            <button
              onClick={() => handleStatusFilter('Abandoned')}
              className={statusFilter === 'Abandoned' ? styles.selected : ''}
            >
              <div className={styles.stabtn}><div className={styles.circlered}></div><p>Abandoned</p></div>
            </button>
            <button
              onClick={() => handleStatusFilter('Others')}
              className={statusFilter === 'Others' ? styles.selected : ''}
            >
              <div className={styles.stabtn}><div className={styles.circleblue}></div><p>Others</p></div>
            </button>
          </div>

          <div className={styles.selectOption}>
            <div className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className={styles.filtersearchLine}>
              <div className={styles.filtervector}>
                <Image src={Vector} alt="Logo" fill />
              </div>
              <input
                type="text"
                placeholder={`Search in ${activeTab}`}
                value={filterSearch}
                className={styles.filtersearchInput}
                onChange={(e) => setFilterSearch(e.target.value)}
              />
            </div>
            <div className={styles.checkboxContainer}>
              {filteredList.map((item, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={item.key}
                    name={item.key}
                    value={item.key}
                    onChange={() => handleCheckboxChange(item.key)}
                  />
                  <label htmlFor={item.key}>{item.key}</label>
                </div>
              ))}
            </div>

          </div>

          <div className={styles.viewMode}>
            <p>Display</p>
            <div className={`${styles.switch} ${viewMode === 'grid' ? styles.grid : ''}`}>
              <button
                className={viewMode === 'list' ? styles.active : ''}
                onClick={() => handleViewModeChange('list')}
              >
                List
              </button>
              <button
                className={viewMode === 'grid' ? styles.active : ''}
                onClick={() => handleViewModeChange('grid')}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
