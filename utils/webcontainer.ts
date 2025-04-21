import { WebContainer } from '@webcontainer/api';
import { EffectCallback, useEffect, useState } from 'react';

let webContainerInstance: WebContainer | null = null;
let isBooting = false;

export async function getWebContainer(): Promise<WebContainer> {
    if (webContainerInstance) {
        return webContainerInstance;
    }
    
    if (isBooting) {
        // Wait for the existing boot process
        while (isBooting) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (webContainerInstance) {
            return webContainerInstance;
        }
    }
    
    try {
        isBooting = true;
        webContainerInstance = await WebContainer.boot();
        console.log("WebContainer instance created");
        return webContainerInstance;
    } finally {
        isBooting = false;
    }
}

export function useWebContainer() {
    const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
    
    useEffect(() => {
        let mounted = true;
        
        const initWebContainer = async () => {
            try {
                const instance = await getWebContainer();
                if (mounted) {
                    setWebContainer(instance);
                }
            } catch (error) {
                console.error('Failed to initialize WebContainer:', error);
            }
        };
        
        initWebContainer();
        
        return () => {
            mounted = false;
        };
    }, []);
    
    return webContainer;
}
