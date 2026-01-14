import { getLocale } from '@/lib/locale'
import PageClient from './page-client'

export default async function Page() {
	const currentLocale = await getLocale()

	return <PageClient currentLocale={currentLocale} />
}
