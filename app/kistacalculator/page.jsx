// In your page.jsx
import Head from 'next/head';
import LoanCalculator from './LoanCalculator';
export default function Page() {
  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@room_and_home" />
        <meta name="twitter:creator" content="@room_and_home" />
        <meta name="twitter:title" content="सजिलैसंग घर गाडीको किस्ता पत्ता लगाउनुहोस-By onlinehome.com.np" />
        <meta name="twitter:description" content="Calculate your monthly home loan EMI instantly. Find out how much you can afford for your dream home or car." />
        <meta name="twitter:image" content="https://onlinehome.com.np/masikKista.png" />
      </Head>
      <LoanCalculator />
    </>
  );
}

//This is continuous deployment or production...