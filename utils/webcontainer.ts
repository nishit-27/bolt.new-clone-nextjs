import { WebContainer } from '@webcontainer/api';
import { EffectCallback, useEffect, useState } from 'react';

let webContainerInstance: WebContainer | null = null;

export async function getWebContainer(): Promise<WebContainer> {
    if (webContainerInstance) {
        return webContainerInstance;
    }
    
    webContainerInstance = await WebContainer.boot();
    console.log("WebContainer instance created");
    return webContainerInstance;
}

export function useWebContainer() {
    const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
    
    useEffect(() => {
        getWebContainer().then(setWebContainer);
    }, []);
    
    return webContainer;
}
