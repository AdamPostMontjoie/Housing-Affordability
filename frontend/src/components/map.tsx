import { useState } from 'react';
import { MapsComponent, LayersDirective, LayerDirective,Inject,MapsTooltip, Highlight,Selection} from '@syncfusion/ej2-react-maps';

import * as usa from '../maps/usa.json';

const SimpleMap = () => {
    //the selected state will be able to be changed from map or from sidebar

    return (
        // Make sure this component has a defined height, 
        // e.g., by giving its parent div a class like 'h-screen'
        <MapsComponent id="maps" zoomSettings={{ enable: true }}>
            <Inject services={[MapsTooltip,Highlight,Selection]} />
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
                    selectionSettings={{ enable: true, fill: '#4C515B', opacity: 1 }}
                />
            </LayersDirective>
        </MapsComponent>
    );
}
export default SimpleMap;