import { Box, Checkbox, FormControlLabel, ListItem, List, Typography, TextField, IconButton, Stack } from '@mui/material';
import './styles/BrowsePage.css';
import { Collapse, ListSubheader } from '@mui/material';
import { ExpandLess, ExpandMore, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: string;
    location: string;
    price: number;
    pricePerMonth: number;
    img: string;
    type: string;
    width: string;
    height: string;
    traffic: string;
    availability: string;
    description?: string;
    landlordName?: string;
    landlordVerified?: boolean;
    rating?: number;
    features?: string[];
    tags?: string[];
}

interface ApiResponse {
    success: boolean;
    listings: Product[];
    total: number;
    message?: string;
}

// Fallback static data (your original data, converted to new interface)
const fallbackProducts: Product[] = [
    { id: '1', location: 'SoHo Building Hall', price: 14500, pricePerMonth: 62350, img: `https://oceanoutdoor.s3.eu-west-2.amazonaws.com/website/wp-content/uploads/2024/05/WR-PLS.-Apr-24-2-1920x1281-1.jpg`, type: 'Wall', width: '25ft', height: '30ft', traffic: '10,000+ daily', availability: '01/15/2025' },
    { id: '2', location: 'Times Square', price: 12050, pricePerMonth: 51815, img: 'https://mandoemedia.com/app/uploads/2023/08/M_UltimateGuide_Retail_01.png', type: 'Vehicle', width: '20ft', height: '28ft', traffic: '5,000+ daily', availability: 'Immediately' },
    { id: '3', location: 'Chelsea', price: 1450, pricePerMonth: 6235, img: 'https://assets.simpleviewinc.com/simpleview/image/upload/crm/howardcounty/Listing-Pic---website-960-x-720---2022-04-21T113542.580_FFB9B994-5056-B3A8-499D03E9CDF44E8C-ffb9b5745056b3a_ffb9c4ba-5056-b3a8-4902c7fd236c3842.png', type: 'Window', width: '25ft', height: '30ft', traffic: '15,000+ daily', availability: '03/10/2025' },
    { id: '4', location: 'DUMBO', price: 11500, pricePerMonth: 49450, img: 'https://houseofmockups.com/cdn/shop/files/HOM-002-017.-Williamsburg-Handpainted-Billboard-Mockup.webp?v=1724180972', type: 'Queens', width: '30ft', height: '40ft', traffic: '5,000+ daily', availability: 'Immediately' },
    { id: '5', location: 'Williamsberg', price: 11150, pricePerMonth: 47945, img: 'https://static.vecteezy.com/system/resources/previews/044/904/036/non_2x/outdoor-billboard-mockup-free-psd.png', type: 'Billboard', width: '20ft', height: '28ft', traffic: '5,000+ daily', availability: '05/20/2025' },
    { id: '6', location: 'Upper East Side', price: 11450, pricePerMonth: 49235, img: 'https://patch.com/img/cdn20/users/26226110/20240109/043757/styles/patch_image/public/r0005773___09160919405.jpg', type: 'Vehicle', width: '19ft', height: '21ft', traffic: '15,000+ daily', availability: 'Immediately' },
];

function BrowseSpace() {
    // Navigation
    const navigate = useNavigate();

    // UI State
    const [open1, setOpen1] = useState<boolean>(true);
    const [open2, setOpen2] = useState<boolean>(true);
    const [open3, setOpen3] = useState<boolean>(true);
    const [open4, setOpen4] = useState<boolean>(true);
    const [open5, setOpen5] = useState<boolean>(true);
    const [open6, setOpen6] = useState<boolean>(true);
    const [priceRange, setPriceRange] = useState<number[]>([1000, 15000]);
    const [selectedOption, setSelectedOption] = useState<string>("week");
    const [minWidth, setMinWidth] = useState<number>(0);
    const [minHeight, setMinHeight] = useState<number>(0);
    const [calendarDate, setcalendarDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedNeighborhoods, setselectedNeighborhoods] = useState<string[]>([]);
    const [selectedspaceTypes, setselectedspaceTypes] = useState<string[]>([]);
    const [selectedTraffic, setselectedTraffic] = useState<string[]>([]);
    const [selectedAvailability, setselectedAvailability] = useState<string[]>([]);

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dataSource, setDataSource] = useState<'api' | 'fallback'>('fallback');

    // Static filter options
    const neighbourhood: string[] = ["SoHo Building Hall", "Times Square", "Chelsea", "DUMBO", "Williamsberg", "Upper East Side"];
    const spaceTypes: string[] = ["Wall", "Window", "Queens", "Billboard", "Vehicle", "Storefront", "Rooftop"];
    const traffic: string[] = ["5,000+ daily", "10,000+ daily", "15,000+ daily", "20,000+ daily"]
    const availability: string[] = ["Available Now"]

    // Navigation function
    const handleViewDetails = (productId: string) => {
        navigate(`/detailsPage/${productId}`);
    };

    // Helper function to extract base location name for filtering
    const getBaseLocation = (title: string): string => {
        if (title.startsWith('SoHo Building Hall')) return 'SoHo Building Hall';
        if (title.startsWith('Times Square')) return 'Times Square';
        if (title.startsWith('Chelsea')) return 'Chelsea';
        if (title.startsWith('DUMBO')) return 'DUMBO';
        if (title.startsWith('Williamsberg')) return 'Williamsberg';
        if (title.startsWith('Upper East Side')) return 'Upper East Side';
        return title;
    };

    // Fetch listings from API
    const fetchListings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Fetching listings from API...');
            
            // Use the proxy setup from your vite.config.ts
            const response = await fetch('/api/test/listings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
            }

            const apiResponse: ApiResponse = await response.json();
            
            if (apiResponse.success && apiResponse.listings) {
                setProducts(apiResponse.listings);
                setDataSource('api');
                console.log(`✅ Successfully fetched ${apiResponse.listings.length} listings from API`);
            } else {
                throw new Error('API returned success: false');
            }
            
        } catch (err) {
            console.error('❌ Error fetching listings from API:', err);
            console.log('🔄 Falling back to static data...');
            
            // Use fallback data
            setProducts(fallbackProducts);
            setDataSource('fallback');
            setError('Using demo data - API connection failed');
        } finally {
            setLoading(false);
        }
    };

    // Test API connection
    const testApiConnection = async () => {
        try {
            const response = await fetch('/api/test/ping');
            const data = await response.json();
            
            if (data.success) {
                console.log('🏓 API connection successful');
                return true;
            }
            return false;
        } catch (err) {
            console.log('❌ API connection failed');
            return false;
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        const initializeData = async () => {
            const apiConnected = await testApiConnection();
            if (apiConnected) {
                await fetchListings();
            } else {
                console.log('🔄 API not available, using fallback data');
                setProducts(fallbackProducts);
                setDataSource('fallback');
                setError('Backend not available - using demo data');
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    // Get current price based on selected option (week/month)
    const getCurrentPrice = (product: Product): number => {
        return selectedOption === "week" ? product.price : product.pricePerMonth;
    };

    // Get price range based on selected option
    const getCurrentPriceRange = (): number[] => {
        if (selectedOption === "week") {
            return priceRange;
        } else {
            // Convert week prices to month prices for filtering
            return [Math.round(priceRange[0] * 4.3), Math.round(priceRange[1] * 4.3)];
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        let isChecked = event.target.checked;

        if (isChecked) {
            setselectedNeighborhoods(([...selectedNeighborhoods, value]));
        } else {
            setselectedNeighborhoods(selectedNeighborhoods.filter((item) => item !== value))
        }
    }

    const handleCheckboxChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        let isChecked = event.target.checked;

        if (isChecked) {
            setselectedspaceTypes(([...selectedspaceTypes, value]));
        } else {
            setselectedspaceTypes(selectedspaceTypes.filter((item) => item !== value))
        }
    }

    const handleCheckboxChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        let isChecked = event.target.checked;

        if (isChecked) {
            setselectedTraffic(([...selectedTraffic, value]));
        } else {
            setselectedTraffic(selectedTraffic.filter((item) => item !== value))
        }
    }

    const handleCheckboxChang3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        let isChecked = event.target.checked;

        if (isChecked) {
            setselectedAvailability([...selectedAvailability, 'Immediately']);
        } else {
            setselectedAvailability(selectedAvailability.filter((item) => item !== 'Immediately'));
        }
    };

    // Filter products based on selected criteria
    const filteredItems = products.filter((item) => {
        const baseLocation = getBaseLocation(item.location);
        const locationMatch = selectedNeighborhoods.length === 0 || selectedNeighborhoods.includes(baseLocation);
        const spacetypeMatch = selectedspaceTypes.length === 0 || selectedspaceTypes.includes(item.type);
        const trafficMatch = selectedTraffic.length === 0 || selectedTraffic.includes(item.traffic);
        
        const currentPriceRange = getCurrentPriceRange();
        const itemPrice = getCurrentPrice(item);
        const PriceMatch = currentPriceRange[0] !== undefined && currentPriceRange[1] !== undefined &&
            itemPrice >= currentPriceRange[0] && itemPrice <= currentPriceRange[1];
            
        const WidthMatch = minWidth === 0 || parseInt(item.width) >= minWidth;
        const HeightMatch = minHeight === 0 || parseInt(item.height) >= minHeight;
        const dateMatch = selectedAvailability.includes('Immediately') ? item.availability === 'Immediately' : true;
        const calendardateMatch = calendarDate ? new Date(item.availability).getTime() === calendarDate.getTime() : true;

        return locationMatch && trafficMatch && spacetypeMatch && PriceMatch && WidthMatch && HeightMatch && dateMatch && calendardateMatch;
    });

    const areFiltersActive = selectedNeighborhoods.length > 0 || selectedspaceTypes.length > 0 || selectedTraffic.length > 0 ||
        selectedAvailability.length > 0 || priceRange[0] !== 1000 || priceRange[1] !== 15000 || minWidth > 0 || minHeight > 0 || calendarDate !== null;

    let itemsperPage = 8;
    const itemsToDisplay = areFiltersActive ? filteredItems : products;
    const totalPages = Math.ceil(itemsToDisplay.length / itemsperPage);

    const startIndex = (currentPage - 1) * itemsperPage;
    const endIndex = startIndex + itemsperPage;
    const currentPageItems = itemsToDisplay.slice(startIndex, endIndex);

    let pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    const prevButton = () => {
        if (currentPage <= 1) {
            return;
        }
        setCurrentPage(currentPage - 1);
    }

    const nextButton = () => {
        if (currentPage >= totalPages) {
            return;
        }
        setCurrentPage(currentPage + 1);
    }

    // Only use filteredItems when filters are active, otherwise use currentPageItems
    const displayedItems: Product[] = areFiltersActive ? filteredItems : currentPageItems;

    const reset = () => {
        setselectedNeighborhoods([]);
        setselectedspaceTypes([]);
        setselectedTraffic([]);
        setselectedAvailability([]);
        setPriceRange([1000, 15000]);
        setMinWidth(0);
        setMinHeight(0);
        setcalendarDate(null);
        setCurrentPage(1);
    }

    return (
        <>
            <Box className='layout'>
                <Box className='sidebar'>
                    <Box className='sidebar-top'>
                        <Box className='filters'>Filters</Box>
                        <button onClick={reset} className='reset'>Reset All</button>
                    </Box>

                    {/* Data Source Indicator */}
                    <Box sx={{ px: 2, py: 1, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #eee' }}>
                        {loading ? (
                            <span>🔄 Loading listings...</span>
                        ) : dataSource === 'api' ? (
                            <span>✅ Live data ({products.length} listings)</span>
                        ) : (
                            <span>⚠️ Demo data ({products.length} listings)</span>
                        )}
                        {error && (
                            <div style={{ color: '#ff6b6b', fontSize: '0.75rem', marginTop: '4px' }}>
                                {error}
                                <button 
                                    onClick={fetchListings}
                                    style={{ 
                                        marginLeft: '8px', 
                                        padding: '2px 6px', 
                                        fontSize: '0.7rem',
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </Box>

                    <Box sx={{ borderBottom: '1px solid rgb(211, 210, 210)' }}>
                        <ListSubheader onClick={() => setOpen1(!open1)} sx={{ cursor: 'pointer' }}>
                            <Box className='sidebar-top'>
                                <Box className='sidebar-text'>Neighborhoods</Box>
                                <Box>
                                    {open1 ? <ExpandLess /> : <ExpandMore />}
                                </Box>
                            </Box>
                        </ListSubheader>

                        <Collapse in={open1}>
                            <List>
                                {neighbourhood.map((location) => (
                                    <ListItem key={location} sx={{ py: 0 }}>
                                        <FormControlLabel value={location} checked={selectedNeighborhoods.includes(location)}
                                            control={<Checkbox onChange={handleCheckboxChange} />}
                                            label={<span style={{ fontSize: 'calc(0.9rem + 0.1vw)' }}>{location}</span>} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </Box>

                    <Box sx={{ borderBottom: '1px solid rgb(211, 210, 210)' }}>
                        <ListSubheader onClick={() => setOpen2(!open2)} sx={{ cursor: 'pointer' }}>
                            <Box className='sidebar-top'>
                                <Box className='sidebar-text'>Space Types</Box>
                                <Box> {open2 ? <ExpandLess /> : <ExpandMore />}</Box>
                            </Box>
                        </ListSubheader>

                        <Collapse in={open2}>
                            <List>
                                {spaceTypes.map((type) => (
                                    <ListItem key={type} sx={{ py: 0 }}>
                                        <FormControlLabel value={type} checked={selectedspaceTypes.includes(type)}
                                            control={<Checkbox onChange={handleCheckboxChange1} />}
                                            label={<span style={{ fontSize: 'calc(0.9rem + 0.1vw)' }}>{type}</span>} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </Box>

                    <Box sx={{ py: 2, borderBottom: '1px solid rgb(211, 210, 210)' }}>
                        <ListSubheader onClick={() => setOpen6(!open6)} sx={{ cursor: 'pointer' }}>
                            <Box className='sidebar-top'>
                                <Box className='sidebar-text'>Price Range</Box>
                                <Box> {open6 ? <ExpandLess /> : <ExpandMore />}</Box>
                            </Box>
                        </ListSubheader>

                        <Collapse in={open6} sx={{ px: 2 }}>
                            <Slider value={priceRange} onChange={(_, newValue) => setPriceRange(newValue as number[])} 
                                valueLabelDisplay="off" min={1000} max={15000}
                                step={500} sx={{ color: 'black', '& .MuiSlider-thumb': { backgroundColor: 'black' } }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <span style={{ fontSize: 'calc(1rem + 0.1vw)' }}>${priceRange[0]}</span>
                                <span style={{ fontSize: 'calc(1rem + 0.1vw)' }}>${priceRange[1]}</span>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <select className="form-select" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}
                                    style={{ outline: 'none', boxShadow: 'none', border: '1px solid rgb(211, 210, 210)', fontSize: 'calc(1rem + 0.1vw)' }}>
                                    <option value="week">Week</option>
                                    <option value="month">Month</option>
                                </select>
                            </Box>
                        </Collapse>
                    </Box>

                    <Box sx={{ py: 3, borderBottom: '1px solid rgb(211, 210, 210)' }}>
                        <ListSubheader onClick={() => setOpen5(!open5)} sx={{ cursor: 'pointer' }}>
                            <Box className='sidebar-top'>
                                <Box className='sidebar-text'>Size</Box>
                                <Box> {open5 ? <ExpandLess /> : <ExpandMore />}</Box>
                            </Box>
                        </ListSubheader>

                        <Collapse in={open5}>
                            <Box className='sidebar-dimensions'>
                                <Box>
                                    <Typography sx={{ mb: 0.5, fontSize: 'calc(0.9rem + 0.1vw)' }}>Width (ft)</Typography>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', width: 'fit-content', border: '1px solid rgb(211, 210, 210)',
                                        padding: '0.3em', borderRadius: '0.4em'
                                    }}>
                                        <TextField value={minWidth.toString()} onChange={(e) => setMinWidth(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                                            variant="outlined" size="small" sx={{ width: 80, border: 'none', '& fieldset': { border: 'none' } }} />
                                        <Stack sx={{ borderRadius: '0 4px 4px 0', backgroundColor: '#f5f5f5' }}>
                                            <IconButton onClick={() => setMinWidth(minWidth + 1)} size="small"
                                                sx={{ p: 0, borderRadius: 0, borderBottom: '1px solid #d3d2d2' }}>
                                                <KeyboardArrowUp fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => setMinWidth(Math.max(0, minWidth - 1))} size="small" sx={{ p: 0, borderRadius: 0 }}>
                                                <KeyboardArrowDown fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography sx={{ mb: 0.5, fontSize: 'calc(0.9rem + 0.1vw)' }}>Height (ft)</Typography>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', width: 'fit-content', border: '1px solid rgb(211, 210, 210)',
                                        padding: '0.3em', borderRadius: '0.4em'
                                    }}>
                                        <TextField value={minHeight.toString()} onChange={(e) => setMinHeight(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                                            variant="outlined" size="small" sx={{ width: 80, border: 'none', '& fieldset': { border: 'none' } }} />
                                        <Stack sx={{ backgroundColor: '#f5f5f5' }}>
                                            <IconButton onClick={() => setMinHeight(minHeight + 1)} size="small"
                                                sx={{ p: 0, borderRadius: 0, borderBottom: '1px solid #d3d2d2' }}>
                                                <KeyboardArrowUp fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => setMinHeight(Math.max(0, minHeight - 1))} size="small" sx={{ p: 0, borderRadius: 0 }}>
                                                <KeyboardArrowDown fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>

                    <Box sx={{ borderBottom: '1px solid rgb(211, 210, 210)' }}>
                        <ListSubheader onClick={() => setOpen3(!open3)} sx={{ cursor: 'pointer' }}>
                            <Box className='sidebar-top'>
                                <Box className='sidebar-text'>Traffic</Box>
                                <Box>{open3 ? <ExpandLess /> : <ExpandMore />}</Box>
                            </Box>
                        </ListSubheader>

                        <Collapse in={open3}>
                            <List>
                                {traffic.map((number) => (
                                    <ListItem key={number} sx={{ py: 0 }}>
                                        <FormControlLabel value={number} checked={selectedTraffic.includes(number)}
                                            control={<Checkbox onChange={handleCheckboxChange2} />}
                                            label={<span style={{ fontSize: 'calc(0.9rem + 0.1vw)' }}>{number}</span>} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </Box>

                    <Box sx={{ borderBottom: '1px solid rgb(211, 210, 210)' }}>
                        <ListSubheader onClick={() => setOpen4(!open4)} sx={{ cursor: 'pointer' }}>
                            <Box className='sidebar-top'>
                                <Box className='sidebar-text'>Availability</Box>
                                <Box>{open4 ? <ExpandLess /> : <ExpandMore />}</Box>
                            </Box>
                        </ListSubheader>

                        <Collapse in={open4}>
                            <List>
                                {availability.map((date) => (
                                    <ListItem key={date} sx={{ py: 0 }}>
                                        <FormControlLabel control={<Checkbox checked={selectedAvailability.includes('Immediately')} onChange={handleCheckboxChang3} />}
                                            label={<span style={{ fontSize: 'calc(0.9rem + 0.1vw)' }}>{date}</span>} />
                                    </ListItem>
                                ))}
                            </List>

                            <Box sx={{ px: 2 }}>
                                <Typography sx={{ fontSize: 'calc(0.9rem + 0.1vw)' }}>Available From</Typography>
                                <Box sx={{ mb: 3 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker value={calendarDate} onChange={(newValue: Date | null) => setcalendarDate(newValue)}
                                            slots={{ openPickerIcon: CalendarToday }}
                                            slotProps={{
                                                textField: {
                                                    size: 'small', sx: {
                                                        width: '100%', '& .MuiOutlinedInput-root': {
                                                            borderRadius: '4px', '& fieldset': { borderColor: '#d3d2d2', },
                                                        },
                                                        '& .MuiInputBase-input': { py: 0.5, height: 'auto' },
                                                    },
                                                },
                                                popper: { sx: { zIndex: 9999 } }
                                            }} />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>

                    <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                        <button>Apply Filters</button>
                    </Box>
                </Box>

                <Box className='main-content'>
                    <Box className='content-heading'>Advertising Spaces in NYC</Box>

                    <Box sx={{ fontSize: 'calc(1rem + 0.5vh)', textAlign: 'left' }}>
                        Showing {displayedItems.length} places matching your criteria
                    </Box>

                    <Box className='cards'>
                        <Box className='car'>
                            {loading ? (
                                // Loading skeleton
                                [...Array(8)].map((_, i) => (
                                    <Box key={i} className="card" sx={{ border: '1px solid #f0f0f0' }}>
                                        <Box sx={{ height: 240, backgroundColor: '#f5f5f5', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                        <Box sx={{ p: 2 }}>
                                            <Box sx={{ height: 20, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 1, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                            <Box sx={{ height: 15, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 1, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                            <Box sx={{ height: 15, backgroundColor: '#f5f5f5', borderRadius: 1, animation: 'pulse 1.5s ease-in-out infinite' }} />
                                        </Box>
                                    </Box>
                                ))
                            ) : filteredItems.length === 0 && areFiltersActive ? (
                                <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'calc(1rem + 2vh)' }}>
                                    No items match your selected filters. Try changing your filters.
                                </p>
                            ) : (
                                displayedItems.map((product) => {
                                    const currentPrice = getCurrentPrice(product);
                                    const priceLabel = selectedOption === "week" ? "/week" : "/month";
                                    
                                    return (
                                        <Box key={product.id} className="card">
                                            <img 
                                                src={product.img} 
                                                style={{ height: '15em', objectFit: 'cover' }}
                                                alt={getBaseLocation(product.location)}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                }}
                                            />

                                            <Box className="card-body" sx={{ textAlign: 'left', borderRadius: '1em', padding: '1em' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Box sx={{ fontSize: 'calc(0.6em + 0.2vw)', fontWeight: 'bold' }}>
                                                        {getBaseLocation(product.location)}
                                                    </Box>
                                                    <Box sx={{ fontSize: 'calc(0.7em + 0vw)', fontWeight: 'bold' }}>
                                                        ${currentPrice.toLocaleString()}
                                                        <span style={{ color: '#666', fontWeight: '400' }}>{priceLabel}</span>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', mt: 2 }}>
                                                    <Box sx={{ fontSize: 'calc(0.6em + 0.2vw)', fontWeight: '500' }}>
                                                        <span style={{ color: '#666' }}>Type</span> : {product.type}
                                                    </Box>
                                                    <Box sx={{ fontSize: 'calc(0.7em + 0.1vw)', marginLeft: '5em', fontWeight: '500' }}>
                                                        <span style={{ color: '#666' }}>Size</span>: {product.width} x {product.height}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.2em' }}>
                                                    <i className="bi bi-people-fill"></i>
                                                    <Box sx={{ fontSize: 'calc(0.7em + 0.1vw)', fontWeight: '500' }}>
                                                        <span style={{ color: '#666' }}>Traffic</span> : {product.traffic}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ fontSize: 'calc(0.7em + 0.1vw)', fontWeight: '500' }}>
                                                    <span style={{ color: '#666' }}>Available</span>: {product.availability}
                                                </Box>

                                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                                    <button 
                                                        style={{ width: '100%', fontSize: 'calc(0.7em + 0.1vw)' }}
                                                        onClick={() => handleViewDetails(product.id)}
                                                    >
                                                        View Details
                                                    </button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })
                            )}
                        </Box>
                    </Box>

                    {!areFiltersActive && totalPages > 1 && !loading && (
                        <Box sx={{ mt: 4 }}>
                            <nav aria-label="Page navigation example">
                                <ul style={{ display: 'flex', alignItems: 'center' }} className="pagination justify-content-center">
                                    <li className="page-item" onClick={prevButton} tabIndex={-1}><i className="bi bi-arrow-left"></i></li>
                                    <li className="page-item" onClick={nextButton} >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.3em', width: '100%' }}>
                                            {pageNumbers.map((num) => {
                                                return (
                                                    <Box key={num}>
                                                        <Box>
                                                            <button 
                                                                className={`pageBtn ${currentPage === num ? 'active' : ''}`} 
                                                                onClick={() => setCurrentPage(num)}
                                                            >
                                                                {num}
                                                            </button>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </li>
                                    <li className="page-item" onClick={nextButton} ><i className="bi bi-arrow-right"></i></li>
                                </ul>
                            </nav>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default BrowseSpace;