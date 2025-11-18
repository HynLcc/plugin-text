'use client';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { EvnContext } from './context/EnvProvider';
import { TextConfig } from './TextConfig';
import { TextViewer } from './TextViewer';

export const TextPages = () => {
  const { t } = useTranslation();
  const { pluginInstallId } = useContext(EvnContext);

  if (!pluginInstallId) {
    return <div className="flex items-center justify-center h-full">{t('initializing')}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="pl-3 py-2 text-lg font-semibold border-b">{t('title')}</h1>
      <TextConfig />
      <TextViewer />
    </div>
  );
};

