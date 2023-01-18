/* eslint-disable */
import React, { ReactNode, useEffect, useRef, useState } from 'react'

const loadDynamicScript: string[] = []

const useDynamicScript = (url: string) => {

    const [ready, setReady] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    React.useEffect(() => {
        if (!url) {
            return;
        }

        const element = document.createElement("script");
        element.src = url;
        element.type = "text/javascript";
        element.async = true;

        setReady(false);
        setFailed(false);

        element.onload = () => {
            loadDynamicScript.push(url)
            setReady(true);
        };

        element.onerror = () => {
            setReady(false);
            setFailed(true);
        };

        document.head.appendChild(element);

        // eslint-disable-next-line consistent-return
        return () => {
            const index = loadDynamicScript.findIndex((ele) => ele === url)
            loadDynamicScript.splice(index, 1)
            document.head.removeChild(element);
        };
    }, [url]);

    return {
        ready,
        failed,
    };
};


type LoadingParam = {
    url: string
}

interface FMReactComponentProps {
    url: string
    scope: string
    module: string
    moduleDeps?: {[dependencyName: string]: any}
    componentProps?: {[name: string]: any}
    loadingScript?: (param: LoadingParam) => ReactNode
    loadingScriptFailed?: (param: LoadingParam) => ReactNode
}

const shareModuleDeps = async (scope: string, moduleDeps?: {[dependencyName: string]: any}) => {
    if (!moduleDeps || moduleDeps.length <= 0 ) return
    let sharedScope: {[key: string] : object} = {}
    for (const dep in moduleDeps) {
        const required = moduleDeps[dep]
        sharedScope[dep] = {
            [required.version]: {
                get: () =>
                    new Promise((resolveShared) => {
                        resolveShared(() => required);
                    }),
                loaded: true,
            }
        }
    }
    //@ts-ignore
    await window[scope].init(sharedScope)
}

const react = require("react")
const reactDom = require("react-dom")

export const FMReactComponent = ({
    url,
    scope,
    module,
    moduleDeps = {},
    loadingScript = () => <div />,
    loadingScriptFailed = () => <div />,
    componentProps = {}
}: FMReactComponentProps) => {
    const { ready, failed } = useDynamicScript(url);

    const [component , setComponent] = useState<any>(<div />)
    useEffect(() => {
        const LazyComponent = React.lazy(
            async () =>
              // eslint-disable-next-line no-return-await
              await (window as any)[scope].get(module).then((factory: any) => {
                const Module = factory();
                return Module;
              })
        );
        setComponent(<LazyComponent {...componentProps} />)
    }, [])

    if (ready) {
        shareModuleDeps(scope, {
            "react": react,
            "react-dom": reactDom,
            ...moduleDeps
        })
    }

    if (!ready) {
      return loadingScript({ url })
    }

    if (failed) {
      return loadingScriptFailed({ url })
    }

    return (
      <React.Suspense fallback="">
          {component}
      </React.Suspense>
    );
}
