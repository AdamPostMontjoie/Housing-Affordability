import * as React from "react";
import { MapsComponent, LayersDirective, LayerDirective,Inject,MapsTooltip, Highlight} from '@syncfusion/ej2-react-maps';

import * as usa from '../maps/usa.json';

const SimpleMap = () => {
    return (
        // Make sure this component has a defined height, 
        // e.g., by giving its parent div a class like 'h-screen'
        <MapsComponent id="maps" zoomSettings={{ enable: true }}>
            <Inject services={[MapsTooltip,Highlight]} />
            <LayersDirective>
                <LayerDirective 
                    shapeData={usa}
                    shapeSettings={{ fill: '#E5E5E5', border: { color: 'black', width: 0.3 } }}
                    dataLabelSettings={{ visible: true, labelPath: 'iso_3166_2', smartLabelMode: 'Hide', textStyle: { color: 'black' } }}
                    tooltipSettings={{
                        visible: true,
                        valuePath: 'name'
                    }}
                    highlightSettings={{
                        enable: true,
                        fill: 'red', 
                        border: { color: '#333333', width: 1 }
                    }}
                />
            </LayersDirective>
        </MapsComponent>
    );
}
export default SimpleMap;