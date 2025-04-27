import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/app/login/page';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// MOCKS
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));
jest.mock('axios');
jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
    success: jest.fn(),
}));

describe('Login Component', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly okey ', () => {
        render(<Login />);
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('can type into email and password fields', () => {
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });

        expect((screen.getByPlaceholderText('Email') as HTMLInputElement).value).toBe(
            'test@example.com',
        );
        expect((screen.getByPlaceholderText('Password') as HTMLInputElement).value).toBe('123456');
    });

    it('shows error if fields are empty and button clicked', async () => {
        render(<Login />);

        fireEvent.click(screen.getByRole('Login'));

        await waitFor(() => {
            expect(require('react-hot-toast').error).toHaveBeenCalled();
        });
    });

    it('successful login stores token and redirects', async () => {
        (axios.post as jest.Mock).mockResolvedValue({
            data: {
                status: true,
                msg: 'Login successful',
                token: 'test-token',
                userData: { id: 1, email: 'test@example.com' },
            },
        });

        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('Login'));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('test-token');
            expect(pushMock).toHaveBeenCalledWith('/');
        });
    });

    it('shows loading state on submit', async () => {
        (axios.post as jest.Mock).mockResolvedValue({
            data: { status: true, msg: 'Success', token: 'token', userData: {} },
        });

        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });

        fireEvent.click(screen.getByText('Login'));

        expect(screen.getByDisplayValue('...loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Login')).toBeInTheDocument();
        });
    });
});
