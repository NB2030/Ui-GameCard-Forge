/**
 * @file ContentTab.tsx
 * This component contains all UI controls for the "Content" tab.
 */
import React from 'react';
import type { CardConfig } from '../../types';
import Section from '../controls/Section';
import TextInput from '../controls/TextInput';
import PriceInput from '../controls/PriceInput';
import PositionControl from '../controls/PositionControl';
import NumberInput from '../controls/NumberInput';

/**
 * @interface TabPanelProps
 * @description Base props that are shared by all tab panel components within the control panel.
 */
export interface TabPanelProps {
    /** @type {CardConfig} The main configuration object that holds the state of the card design. */
    config: CardConfig;
    /** @type {(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void} A generic handler function to update the configuration state when a control's value changes. */
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    /** @type {boolean} A flag to indicate if dark mode is enabled. */
    isDark: boolean;
}

/**
 * @interface ContentTabProps
 * @description Props specific to the ContentTab component, extending the base TabPanelProps.
 * @extends {TabPanelProps}
 */
interface ContentTabProps extends TabPanelProps {
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle the main card image upload event. */
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle the custom currency icon upload event. */
  onCustomCurrencyIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @description A component that renders the UI controls for the "Content" tab. It allows users to set the text for the title, price, and button, and to adjust the main image's position and scale.
 * @param {ContentTabProps} props The props for the component.
 * @returns {React.ReactElement} The rendered tab panel for content editing.
 */
const ContentTab: React.FC<ContentTabProps> = ({
    config,
    handleChange,
    onImageUpload,
    onCustomCurrencyIconUpload,
    isDark,
}) => {

    return (
        <div className="space-y-6">
            <Section title="Text Content" isDark={isDark}>
                <TextInput label="Title" id="title" value={config.title} onChange={handleChange} isDark={isDark} />
                <PriceInput
                  label="Price"
                  priceId="price"
                  currencyId="priceCurrencySymbol"
                  priceCurrencySymbolOffsetXId="priceCurrencySymbolOffsetX"
                  useIconId="useCustomCurrencyIcon"
                  priceValue={config.price}
                  currencyValue={config.priceCurrencySymbol}
                  priceCurrencySymbolOffsetXValue={config.priceCurrencySymbolOffsetX}
                  useIconValue={config.useCustomCurrencyIcon}
                  onChange={handleChange}
                  onIconUpload={onCustomCurrencyIconUpload}
                  iconSizeId="customCurrencyIconSize"
                  iconOffsetXId="customCurrencyIconOffsetX"
                  iconOffsetYId="customCurrencyIconOffsetY"
                  iconSizeValue={config.customCurrencyIconSize}
                  iconOffsetXValue={config.customCurrencyIconOffsetX}
                  iconOffsetYValue={config.customCurrencyIconOffsetY}
                  isDark={isDark}
                />
                <TextInput label="Button Text" id="buttonText" value={config.buttonText} onChange={handleChange} isDark={isDark} />
            </Section>
            {config.image && (
                <Section title="Image Adjustments" isDark={isDark}>
                    <PositionControl
                        label="Image Position"
                        idX="imageOffsetX"
                        idY="imageOffsetY"
                        valueX={config.imageOffsetX || 0}
                        valueY={config.imageOffsetY || 0}
                        onChange={handleChange}
                        isDark={isDark}
                    />
                    <NumberInput
                        label="Image Scale (Zoom)"
                        id="imageScale"
                        value={config.imageScale || 1}
                        onChange={handleChange}
                        min={0.1}
                        step={0.1}
                        isDark={isDark}
                    />
                </Section>
            )}
        </div>
    );
};

export default ContentTab;