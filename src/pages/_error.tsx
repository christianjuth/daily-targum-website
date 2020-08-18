import React from 'react';
import NextErrorComponent from 'next/error';
import * as Sentry from '@sentry/node';
import { ErrorProps } from 'next/error';
import { NextPageContext } from 'next';
import { Section, Theme, Text, Button } from '../components';
import { styleHelpers, nextUtils } from '../utils';
import { useRouter } from 'next/router';
import Link from 'next/link';


interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun: boolean
  err: any
}

function ErrorPage({ 
  statusCode, 
  hasGetInitialPropsRun, 
  err 
}: CustomErrorProps) {
  const styles = Theme.useStyleCreator(styleCreator);
  const canGoBack = nextUtils.useCanGoBack();
  const router = useRouter();

  console.log('THIS IS AN ERROR', hasGetInitialPropsRun, err, statusCode)

  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err)
  }

  return (
    <Section 
      style={styles.section}
      styleInside={styles.sectionInside}
    >
      <div style={styles.textWrap}>
        <Text variant='h1' htmlTag='h1'>An Error Occured</Text>
        <Text variant='p'>Sorry, it's us, not you.</Text>
        {canGoBack ? (
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        ) : (
          <Link href='/'>
            <a>
              <Button>
                Go to Home
              </Button>
            </a>
          </Link>
        )}
        
      </div>
    </Section>
  )
};

const styleCreator = Theme.makeStyleCreator(theme => ({
  section: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    flex: 1,
    justifyContent: 'center'
  },
  sectionInside: {
    ...styleHelpers.flex('column'),
    alignItems: 'center'
  },
  textWrap: {
    ...styleHelpers.flex('column'),
    alignItems: 'flex-start'
  }
}));

ErrorPage.getInitialProps = async (ctx: NextPageContext) => {
  const { res, err, asPath } = ctx;

  const errorInitialProps = await NextErrorComponent.getInitialProps(ctx)

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  // @ts-ignore
  errorInitialProps.hasGetInitialPropsRun = true

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (res?.statusCode === 404) {
    // Opinionated: do not record an exception in Sentry for 404
    return { statusCode: 404 }
  }
  if (err) {
    Sentry.captureException(err)
    await Sentry.flush(2000)
    return errorInitialProps
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  )
  await Sentry.flush(2000)

  return errorInitialProps
};

export default ErrorPage;