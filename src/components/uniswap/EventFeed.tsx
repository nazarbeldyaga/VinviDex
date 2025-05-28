import { defaultTheme, SwapEventHandlers, TransactionEventHandlers, WidgetEventHandlers } from '@uniswap/widgets'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '@/context/AuthContext';

const EventFeedWrapper = styled.div`
    background-color: ${defaultTheme.container};
    border-radius: ${defaultTheme.borderRadius.medium}rem;
    box-sizing: border-box;
    font-family: ${defaultTheme.fontFamily.font};
    padding: 1rem;
    width: 100%;
    margin-top: 1rem;
    color: black;
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
`

const EventColumn = styled.div`
    height: 306px;
    overflow: auto;
`

const EventRow = styled.div`
    background-color: ${defaultTheme.module};
    border-radius: ${defaultTheme.borderRadius.medium / 2}rem;
    margin: 0.5rem 0;
    padding: 0.2rem 0.2rem 0.5rem;
    color: black;
`

const EventData = styled.pre`
    margin: 0.5rem 0 0;
    overflow-x: auto;
    font-size: 12px;
    color: black;
`

const Subhead1 = styled.h3`
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: black;
`

const Subhead2 = styled.h4`
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    padding: 0;
    color: black;
`

const ClearButton = styled.button`
    background-color: ${defaultTheme.accent};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        opacity: 0.8;
    }
`

const EventSelect = styled.select`
    background-color: white;
    color: black;
    border: 1px solid ${defaultTheme.outline};
    border-radius: 8px;
    padding: 4px 8px;

    option {
        background-color: white;
        color: black;
    }
`

export const HANDLERS: (keyof SwapEventHandlers | keyof TransactionEventHandlers | keyof WidgetEventHandlers)[] = [
    'onAmountChange',
    'onConnectWalletClick',
    'onError',
    'onExpandSwapDetails',
    'onReviewSwapClick',
    'onSettingsReset',
    'onSlippageChange',
    'onSubmitSwapClick',
    'onSwapApprove',
    'onSwapPriceUpdateAck',
    'onSwapSend',
    'onSwitchChain',
    'onSwitchTokens',
    'onTokenAllowance',
    'onTokenChange',
    'onTokenSelectorClick',
    'onTransactionDeadlineChange',
    'onTxFail',
    'onTxSubmit',
    'onTxSuccess',
    'onWrapSend',
]

const SHOW_ALL_EVENTS = '(show all events)'

export interface Event {
    name: string;
    data: unknown[];
    timestamp: number;
}

export interface EventFeedProps {
    events: Event[];
    onClear: () => void;
}

export default function EventFeed({ events, onClear }: EventFeedProps) {
    const [selectedEventType, setSelectedEventType] = useState<string>(SHOW_ALL_EVENTS);
    const { setIsLoggedIn } = useAuth();

    useEffect(() => {
        const connectEvents = events.filter(event => event.name === 'onConnectWalletClick');
        if (connectEvents.length > 0) {
            setIsLoggedIn(true);
        }
    }, [events, setIsLoggedIn]);

    return (
        <EventFeedWrapper>
            <Row>
                <Subhead1>Event Feed</Subhead1>
                <ClearButton onClick={onClear}>
                    Clear
                </ClearButton>
            </Row>
            <Row>
                <Subhead2>Filter: </Subhead2>
                <EventSelect
                    onChange={(e) => setSelectedEventType(e.target.value)}
                    value={selectedEventType}
                >
                    <option>{SHOW_ALL_EVENTS}</option>
                    {HANDLERS.map((name) => (
                        <option key={name}>{name}</option>
                    ))}
                </EventSelect>
            </Row>
            <EventColumn>
                {events
                    ?.filter(({ name }) => (selectedEventType === SHOW_ALL_EVENTS ? true : name === selectedEventType))
                    .map(({ name, data, timestamp }, i) => (
                        <EventRow key={i}>
                            <Row>
                                <Subhead2>
                                    {name}
                                </Subhead2>
                                <span style={{ fontSize: '12px', color: 'black' }}>
                  {new Date(timestamp).toLocaleTimeString()}
                </span>
                            </Row>
                            <EventData>{JSON.stringify(data, null, 2)}</EventData>
                        </EventRow>
                    ))}
            </EventColumn>
        </EventFeedWrapper>
    )
}