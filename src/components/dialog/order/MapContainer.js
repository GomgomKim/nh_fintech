import React, { useEffect } from 'react';

// const { kakao } = window;

const MapContainer = () => {

    useEffect(() => {
        // const container = document.getElementById('myMap');
		// const options = {
        //     // 블릭트 위치
		// 	center: new kakao.maps.LatLng(37.518663, 127.040514),
		// 	level: 3
		// };
        // const map = new kakao.maps.Map(container, options);
    }, []);

    return (
        <div id='myMap' style={{
            width: '100%', 
            height: '600px',
            float: 'left'
        }}></div>
    );
}

export default MapContainer; 