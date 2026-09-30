export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-200 shadow-inner mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Personal Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
