import ErrorPage from '@/components/errorPage';

export default async function Custom404() {
  return <ErrorPage error={"Page not found"} />;
}
