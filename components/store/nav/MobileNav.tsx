import {Fragment} from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import {navigation} from './navConfig';

import {XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {NavProps} from './navConfig'


const MobileNav: React.FC<NavProps> = ({open, setOpen}) => {
    return (
        <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />
                <div className="fixed inset-0 z-40 flex">
                  <DialogPanel
                    transition
                    className="relative flex w-full max-h-52 transform flex-col bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-y-full"
                  >
                    <div className="flex px-4 pt-5 pb-2">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
        
                  
        
                    <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                      {navigation.pages.map((page) => (
                        <div key={page.name} className="flow-root">
                          <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                            {page.name}
                          </a>
                        </div>
                      ))}
                    </div>
        

                  </DialogPanel>
                </div>
              </Dialog>
    )
}

export default MobileNav;