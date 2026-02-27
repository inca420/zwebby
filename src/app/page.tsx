import LoginButton from '@/components/auth/LoginButton';
import { Wand2, Layout, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl">
              <Wand2 className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Welcome to Zwebby
          </h1>
          <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            The AI-powered website building engine. Generate full blocks of content
            with OpenRouter and orchestrate your site structure in seconds.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <LoginButton />
          </div>

          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 text-left">
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-orange-600">
                  <Layout className="text-white w-6 h-6" />
                </div>
                Block-Based Builder
              </dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Construct your website from the ground up using a flexible block
                architecture that puts you in control.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-orange-600">
                  <Zap className="text-white w-6 h-6" />
                </div>
                AI Text Generation
              </dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Stop staring at a blank page. Instantly fill your blocks with
                relevant, specialized content powered by multiple LLM backends.
              </dd>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
