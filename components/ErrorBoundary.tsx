import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
 
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
 
    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className="flex min-h-dynamic h-dynamic items-center justify-center p-10 mesh-gradient">
          <Card className="w-full md:w-3/4 lg:w-1/2 h-full max-h-full flex flex-col items-center p-4 bg-white/75 rounded-3xl">
            <CardHeader className={`text-center min-h-[50%] h-1/2 flex flex-col items-center justify-end`}>
              <CardTitle>
                <svg className="h-auto max-w-[350px] w-full" width="852" height="165" viewBox="0 0 852 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M178.035 131.641V32.2409H221.995C226.568 32.2409 230.768 33.1742 234.595 35.0409C238.515 36.9076 241.875 39.4276 244.675 42.6009C247.568 45.7742 249.761 49.3209 251.255 53.2409C252.841 57.1609 253.635 61.1742 253.635 65.2809C253.635 69.4809 252.888 73.5409 251.395 77.4609C249.995 81.2876 247.941 84.6476 245.235 87.5409C242.528 90.4342 239.355 92.6742 235.715 94.2609L258.395 131.641H237.115L216.675 98.3209H197.355V131.641H178.035ZM197.355 81.3809H221.575C224.001 81.3809 226.148 80.6809 228.015 79.2809C229.881 77.7876 231.375 75.8276 232.495 73.4009C233.615 70.9742 234.175 68.2676 234.175 65.2809C234.175 62.1076 233.521 59.3542 232.215 57.0209C230.908 54.5942 229.228 52.6809 227.175 51.2809C225.215 49.8809 223.068 49.1809 220.735 49.1809H197.355V81.3809ZM384.96 114.701V131.641H315.94V32.2409H383.7V49.1809H335.26V73.1209H377.12V88.8009H335.26V114.701H384.96ZM478.842 32.5209H496.762L508.102 65.4209L519.582 32.5209H537.362L520.282 77.7409L532.882 109.381L561.022 32.2409H582.022L542.262 131.641H525.602L508.102 89.9209L490.742 131.641H474.082L434.462 32.2409H455.182L483.462 109.381L495.782 77.7409L478.842 32.5209ZM706.025 114.701V131.641H637.005V32.2409H704.765V49.1809H656.325V73.1209H698.185V88.8009H656.325V114.701H706.025ZM845.967 106.021C845.967 111.621 844.52 116.334 841.627 120.161C838.734 123.894 834.814 126.741 829.867 128.701C825.014 130.661 819.694 131.641 813.907 131.641H765.887V32.2409H819.087C823.754 32.2409 827.767 33.5009 831.127 36.0209C834.58 38.4476 837.194 41.6209 838.967 45.5409C840.834 49.3676 841.767 53.3809 841.767 57.5809C841.767 62.3409 840.554 66.8676 838.127 71.1609C835.7 75.4542 832.154 78.6276 827.487 80.6809C833.18 82.3609 837.66 85.3942 840.927 89.7809C844.287 94.1676 845.967 99.5809 845.967 106.021ZM826.507 102.381C826.507 99.8609 825.994 97.6209 824.967 95.6609C823.94 93.6076 822.54 92.0209 820.767 90.9009C819.087 89.6876 817.127 89.0809 814.887 89.0809H785.207V115.261H813.907C816.24 115.261 818.34 114.701 820.207 113.581C822.167 112.368 823.707 110.781 824.827 108.821C825.947 106.861 826.507 104.714 826.507 102.381ZM785.207 48.7609V73.8209H810.967C813.114 73.8209 815.074 73.3076 816.847 72.2809C818.62 71.2542 820.02 69.8076 821.047 67.9409C822.167 66.0742 822.727 63.8342 822.727 61.2209C822.727 58.7009 822.214 56.5076 821.187 54.6409C820.254 52.7742 818.947 51.3276 817.267 50.3009C815.68 49.2742 813.86 48.7609 811.807 48.7609H785.207Z" fill="currentColor"/>
                  <path d="M13.0348 52.7658C13.0348 58.3685 10.8091 63.7417 6.84746 67.7033C-1.40232 75.9531 -1.40232 89.3286 6.84746 97.5784C10.8091 101.54 13.0348 106.913 13.0348 112.516C13.0348 124.183 22.4927 133.641 34.1597 133.641C39.7624 133.641 45.1356 135.867 49.0973 139.828C57.347 148.078 70.7226 148.078 78.9724 139.828C82.9341 135.867 88.3072 133.641 93.9099 133.641C105.577 133.641 115.035 124.183 115.035 112.516C115.035 106.913 117.26 101.54 121.222 97.5785C129.472 89.3287 129.472 75.9531 121.222 67.7033C117.26 63.7416 115.035 58.3684 115.035 52.7658C115.035 41.0988 105.577 31.6409 93.9099 31.6409C88.3072 31.6409 82.934 29.4152 78.9724 25.4535C70.7226 17.2038 57.347 17.2038 49.0973 25.4535C45.1356 29.4152 39.7624 31.6409 34.1597 31.6409C22.4927 31.6409 13.0348 41.0988 13.0348 52.7658Z" fill="currentColor"/>
                </svg>
              </CardTitle>
              <CardDescription>Share Files Anonymously, Effortlessly.</CardDescription>
            </CardHeader>
            
            <CardContent className="text-center text-sm text-gray-700 max-w-md w-full">
              <p className="my-2">You seem to have been disconnected from the server :[</p>
              <p className="my-2">This could be because of our servers being down or network problems from your end. Please try refreshing.</p>
              <Link href={"/"} className="block mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-4 py-2">Refresh</Link>
            </CardContent>

            <CardFooter className="flex items-center justify-center mt-auto text-xs">
              Made by <Link className="mx-1 text-blue-500" target={"_blank"} rel={"noopener noreferrer"} href={"https://twitter.com/pranshuj73"}>@pranshuj73</Link> with <span className="text-red-500 ml-1">❤</span>
            </CardFooter>
          </Card>

        </main>
      )
    }
 
    // Return children components in case of no error
 
    return this.props.children
  }
}
 
export default ErrorBoundary