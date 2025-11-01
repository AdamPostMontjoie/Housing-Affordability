import * as React from "react";
import { MapsComponent, LayersDirective, LayerDirective } from '@syncfusion/ej2-react-maps';

// Assumes you moved this to 'src/maps/australia.json'
import * as australia from '../maps/australia.json';

const SimpleMap = () => {
    return (
        // Make sure this component has a defined height, 
        // e.g., by giving its parent div a class like 'h-screen'
        <MapsComponent id="maps" zoomSettings={{ enable: true }}>
            <LayersDirective>
                <LayerDirective 
                    shapeData={australia}
                    // 'shapeSettings' is what gives the map its color
                    shapeSettings={{ 
                        autofill: true,
                        border: { width: 0.5, color: 'white' } 
                    }} 
                />
            </LayersDirective>
        </MapsComponent>
    );
}
export default SimpleMap;