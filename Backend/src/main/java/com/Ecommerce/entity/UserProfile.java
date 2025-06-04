    package com.Ecommerce.entity;

    import jakarta.persistence.*;

    import java.time.LocalDate;
    import java.util.Objects;

    @Entity
    @Table(name = "user_profiles")
    public class UserProfile extends BaseEntity {

        @OneToOne
        @JoinColumn(name = "user_id")
        private User user;

        @Column(name = "first_name")
        private String firstName;

        @Column(name = "last_name")
        private String lastName;

        @Column(name = "date_of_birth")
        private LocalDate dateOfBirth;

        @Enumerated(EnumType.STRING)
        private Gender gender;

        @Column(name = "avatar_url")
        private String avatarUrl;

        @Column(name = "shopee_coins")
        private Integer shopeeCoins = 0;

        public UserProfile() {
        }

        public UserProfile(User user, String firstName, String lastName, LocalDate dateOfBirth,
                           Gender gender, String avatarUrl, Integer shopeeCoins) {
            this.user = user;
            this.firstName = firstName;
            this.lastName = lastName;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.avatarUrl = avatarUrl;
            this.shopeeCoins = shopeeCoins;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public LocalDate getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }

        public Gender getGender() {
            return gender;
        }

        public void setGender(Gender gender) {
            this.gender = gender;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }

        public Integer getShopeeCoins() {
            return shopeeCoins;
        }

        public void setShopeeCoins(Integer shopeeCoins) {
            this.shopeeCoins = shopeeCoins;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof UserProfile)) return false;
            if (!super.equals(o)) return false;
            UserProfile that = (UserProfile) o;
            return Objects.equals(getUser(), that.getUser()) &&
                    Objects.equals(getFirstName(), that.getFirstName()) &&
                    Objects.equals(getLastName(), that.getLastName()) &&
                    Objects.equals(getDateOfBirth(), that.getDateOfBirth()) &&
                    getGender() == that.getGender() &&
                    Objects.equals(getAvatarUrl(), that.getAvatarUrl()) &&
                    Objects.equals(getShopeeCoins(), that.getShopeeCoins());
        }

        @Override
        public int hashCode() {
            return Objects.hash(super.hashCode(), getUser(), getFirstName(), getLastName(),
                    getDateOfBirth(), getGender(), getAvatarUrl(), getShopeeCoins());
        }

        public enum Gender {
            MALE, FEMALE, OTHER
        }
    }
